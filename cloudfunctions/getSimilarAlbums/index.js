/**
 * getSimilarAlbums：基于 Embedding 余弦相似度检索相似专辑
 *
 * 入参：
 *   albumId {string} 目标专辑 _id（必填）
 *   topK    {number} 返回数量，默认 6
 *
 * 出参：
 *   { success, similar: [{ id, title, artist, coverUrl, year, genre, similarity, reason }] }
 *
 * 说明：专辑规模（百级）下全量取回在内存中计算余弦相似度，
 * 避免引入外部向量库；数据量增长后可换成预计算 top-K 或向量检索服务。
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

const PROJECTION = {
  title: true,
  artist: true,
  coverUrl: true,
  year: true,
  genre: true,
  embedding: true
};

function normalizeGenres(rawGenre) {
  if (Array.isArray(rawGenre)) return rawGenre.filter(Boolean);
  if (typeof rawGenre === 'string' && rawGenre) {
    return rawGenre.split(',').map(g => g.trim()).filter(Boolean);
  }
  return [];
}

function getDecade(year) {
  const y = Number(year);
  if (!y || isNaN(y)) return null;
  return `${Math.floor(y / 10) * 10}s`;
}

function cosine(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

// 生成推荐解释：优先共享流派，其次同年代
function buildReason(targetGenres, targetDecade, candidate) {
  const candidateGenres = normalizeGenres(candidate.genre).map(g => g.toLowerCase());
  const shared = targetGenres.filter(g => candidateGenres.includes(g.toLowerCase()));

  if (shared.length > 0) {
    return shared.slice(0, 2).join(' / ');
  }
  const candidateDecade = getDecade(candidate.year);
  if (targetDecade && candidateDecade === targetDecade) {
    return `${targetDecade} 同年代`;
  }
  return '风格相近';
}

exports.main = async (event) => {
  const { albumId, topK = 6 } = event || {};

  if (!albumId) {
    return { success: false, errMsg: '缺少 albumId 参数' };
  }

  try {
    const MAX_LIMIT = 100;
    const countRes = await db.collection('albums').count();
    const total = countRes.total;
    const batchTimes = Math.ceil(total / MAX_LIMIT);
    const tasks = [];
    for (let i = 0; i < batchTimes; i++) {
      tasks.push(
        db.collection('albums')
          .skip(i * MAX_LIMIT)
          .limit(MAX_LIMIT)
          .field(PROJECTION)
          .get()
      );
    }
    const results = await Promise.all(tasks);
    const albums = results.reduce((acc, cur) => acc.concat(cur.data), []);

    const target = albums.find(a => a._id === albumId);
    if (!target) {
      return { success: false, errMsg: `未找到专辑 ${albumId}` };
    }

    const targetGenres = normalizeGenres(target.genre);
    const targetDecade = getDecade(target.year);

    const similar = albums
      .filter(a => a._id !== albumId)
      .map(candidate => ({
        candidate,
        similarity: cosine(target.embedding, candidate.embedding)
      }))
      // 无向量的专辑按同流派/同年代给一个基础分，保证兜底可用
      .map(({ candidate, similarity }) => {
        if (similarity > 0) {
          return { candidate, similarity };
        }
        const candidateGenres = normalizeGenres(candidate.genre).map(g => g.toLowerCase());
        const overlap = targetGenres.filter(g => candidateGenres.includes(g.toLowerCase())).length;
        const sameDecade = targetDecade && getDecade(candidate.year) === targetDecade ? 0.1 : 0;
        return { candidate, similarity: overlap * 0.15 + sameDecade };
      })
      .filter(item => item.similarity > 0)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, Math.max(1, Math.min(topK, 20)))
      .map(({ candidate, similarity }) => ({
        id: candidate._id,
        title: candidate.title,
        artist: candidate.artist,
        coverUrl: candidate.coverUrl,
        year: candidate.year,
        genre: normalizeGenres(candidate.genre),
        similarity: Number(similarity.toFixed(4)),
        reason: buildReason(targetGenres, targetDecade, candidate)
      }));

    return { success: true, similar };
  } catch (err) {
    console.error('[getSimilarAlbums] failed:', err);
    return { success: false, errMsg: err.message || String(err) };
  }
};
