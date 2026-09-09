/**
 * getUserTaste：聚合用户行为，生成品味画像
 *
 * 入参：
 *   topN {number} 返回的 top 流派/年代数量，默认 5
 *
 * 出参：
 *   {
 *     success,
 *     taste: {
 *       topGenres:   [{ name, weight }],
 *       topDecades:  [{ name, weight }],
 *       topArtists:  [{ name, weight }],
 *       interactions: number,
 *       hasProfile: boolean
 *     }
 *   }
 *
 * 权重设计：
 *   favorite 3 > view 1 > skip -1（负反馈）
 *   unfavorite 视为对曾收藏内容的撤销，不参与聚合
 *   时间衰减：30 天前的行为权重减半
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

const ACTION_WEIGHTS = { favorite: 3, view: 1, skip: -1, unfavorite: 0 };
const MAX_INTERACTIONS = 500;
const HALF_LIFE_DAYS = 30;

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

function topN(map, n) {
  return Object.entries(map)
    .filter(([, weight]) => weight > 0)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([name, weight]) => ({ name, weight: Number(weight.toFixed(2)) }));
}

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { topN = 5 } = event || {};

  if (!OPENID) {
    return { success: false, errMsg: '无法获取用户身份' };
  }

  try {
    const res = await db.collection('interactions')
      .where({ openid: OPENID, action: _.neq('unfavorite') })
      .orderBy('createdAt', 'desc')
      .limit(MAX_INTERACTIONS)
      .get();

    const interactions = res.data;
    if (interactions.length === 0) {
      return {
        success: true,
        taste: { topGenres: [], topDecades: [], topArtists: [], interactions: 0, hasProfile: false }
      };
    }

    // 取出涉及专辑的流派/年代信息
    const albumIds = [...new Set(interactions.map(i => i.albumId))];
    const albumTasks = [];
    for (let i = 0; i < albumIds.length; i += 100) {
      albumTasks.push(
        db.collection('albums')
          .where({ _id: _.in(albumIds.slice(i, i + 100)) })
          .field({ genre: true, year: true, artist: true })
          .get()
      );
    }
    const albumResults = await Promise.all(albumTasks);
    const albumMap = new Map();
    albumResults.forEach(r => r.data.forEach(a => albumMap.set(a._id, a)));

    // 聚合：动作权重 × 时间衰减
    const genreWeights = {};
    const decadeWeights = {};
    const artistWeights = {};
    const now = Date.now();

    interactions.forEach(item => {
      const album = albumMap.get(item.albumId);
      if (!album) return;

      const ageDays = (now - new Date(item.createdAt).getTime()) / 86400000;
      const decay = Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
      const weight = (ACTION_WEIGHTS[item.action] || 0) * decay;
      if (weight === 0) return;

      normalizeGenres(album.genre).forEach(g => {
        genreWeights[g] = (genreWeights[g] || 0) + weight;
      });
      const decade = getDecade(album.year);
      if (decade) decadeWeights[decade] = (decadeWeights[decade] || 0) + weight;
      if (album.artist) artistWeights[album.artist] = (artistWeights[album.artist] || 0) + weight;
    });

    return {
      success: true,
      taste: {
        topGenres: topN(genreWeights, topN),
        topDecades: topN(decadeWeights, topN),
        topArtists: topN(artistWeights, topN),
        interactions: interactions.length,
        hasProfile: topN(genreWeights, 1).length > 0
      }
    };
  } catch (err) {
    console.error('[getUserTaste] failed:', err);
    return { success: false, errMsg: err.message || String(err) };
  }
};
