/**
 * 用户品味画像与个性化推荐（P2）
 *
 * 数据源：本地存储的收藏（favorites）与浏览历史（history），
 * 结合专辑 Embedding（genre-feature-v1）计算品味向量。
 * 云端的 recordInteraction / getUserTaste 提供同一行为的持久化，
 * 两者互补：本地画像保证离线可用，云端画像支撑后续 RAG / 跨端能力。
 *
 * 权重：favorite 3 > history view 1，均带时间衰减（14 天半衰期）
 */

const FAVORITE_WEIGHT = 3;
const HISTORY_WEIGHT = 1;
const HALF_LIFE_DAYS = 14;
const MAX_SIGNALS = 50;

function cosine(a, b) {
  if (!Array.isArray(a) || !Array.isArray(b) || a.length !== b.length) return 0;
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

function getDecade(year) {
  const y = Number(year);
  if (!y || isNaN(y)) return null;
  return `${Math.floor(y / 10) * 10}s`;
}

function readStorage(key) {
  try {
    return wx.getStorageSync(key) || [];
  } catch (err) {
    return [];
  }
}

// 从收藏 + 历史构建品味向量（L2 归一化）
function buildTasteVector(albums) {
  const albumMap = new Map(albums.map(a => [a._id, a]));
  const now = Date.now();

  // 收藏和历史里可能存的是摘要对象（无 embedding），需映射回专辑全量数据
  const signals = [];
  (readStorage('favorites') || []).forEach(item => {
    signals.push({ id: item.id, weight: FAVORITE_WEIGHT, timestamp: item.timestamp || now });
  });
  (readStorage('history') || []).forEach(item => {
    signals.push({ id: item.id, weight: HISTORY_WEIGHT, timestamp: item.timestamp || now });
  });

  const seen = new Map();
  signals.forEach(({ id, weight, timestamp }) => {
    const ageDays = (now - timestamp) / 86400000;
    const decay = Math.pow(0.5, ageDays / HALF_LIFE_DAYS);
    seen.set(id, (seen.get(id) || 0) + weight * decay);
  });

  const dim = (albums.find(a => Array.isArray(a.embedding) && a.embedding.length > 0) || {}).embedding;
  if (!dim) return null;

  const vector = new Array(dim.length).fill(0);
  let signalCount = 0;
  seen.forEach((weight, id) => {
    const album = albumMap.get(id);
    if (!album || !Array.isArray(album.embedding)) return;
    signalCount++;
    for (let i = 0; i < vector.length; i++) vector[i] += album.embedding[i] * weight;
  });

  if (signalCount === 0) return null;

  const norm = Math.sqrt(vector.reduce((sum, v) => sum + v * v, 0));
  if (norm === 0) return null;
  return {
    vector: vector.map(v => v / norm),
    signalCount
  };
}

// 提取用户偏好标签（用于推荐解释）
function getPreferredLabels(albums) {
  const genreWeights = {};
  const decadeWeights = {};

  const accumulate = (album, weight) => {
    (Array.isArray(album.genre) ? album.genre : []).forEach((g, i) => {
      const key = String(g).trim();
      if (key) genreWeights[key] = (genreWeights[key] || 0) + weight * (i === 0 ? 1 : 0.5);
    });
    const decade = getDecade(album.year);
    if (decade) decadeWeights[decade] = (decadeWeights[decade] || 0) + weight;
  };

  (readStorage('favorites') || []).forEach(item => {
    const album = albums.find(a => a._id === item.id);
    if (album) accumulate(album, FAVORITE_WEIGHT);
  });
  (readStorage('history') || []).slice(0, MAX_SIGNALS).forEach(item => {
    const album = albums.find(a => a._id === item.id);
    if (album) accumulate(album, HISTORY_WEIGHT);
  });

  const top = map => Object.entries(map)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([name]) => name);

  return { genres: top(genreWeights), decades: top(decadeWeights) };
}

// 生成推荐解释：优先流派共鸣，其次年代
function buildReason(album, preferred) {
  const albumGenres = (Array.isArray(album.genre) ? album.genre : []).map(g => String(g).trim());
  const sharedGenre = preferred.genres.find(g => albumGenres.some(ag => ag.toLowerCase() === g.toLowerCase()));
  if (sharedGenre) return `因为你常听 ${sharedGenre}`;

  const decade = getDecade(album.year);
  if (decade && preferred.decades.includes(decade)) return `你偏爱 ${decade} 的声音`;

  return '符合你的口味';
}

/**
 * 个性化推荐：返回与品味向量最相近的 N 张专辑（排除已收藏）
 * @param {Array} albums 全量专辑
 * @param {Object} options { topN, excludeIds }
 */
function recommendForYou(albums, options = {}) {
  const { topN = 6, excludeIds = [] } = options;
  const taste = buildTasteVector(albums);
  if (!taste) return [];

  const preferred = getPreferredLabels(albums);
  const excludeSet = new Set(excludeIds);

  return albums
    .filter(album =>
      !excludeSet.has(album._id) &&
      Array.isArray(album.embedding) &&
      album.embedding.length > 0
    )
    .map(album => ({
      album,
      similarity: cosine(album.embedding, taste.vector)
    }))
    .filter(item => item.similarity > 0.05)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, topN)
    .map(({ album, similarity }) => ({
      id: album._id,
      title: album.title,
      artist: album.artist,
      coverUrl: album.coverUrl,
      similarity: Number(similarity.toFixed(4)),
      reason: buildReason(album, preferred)
    }));
}

module.exports = {
  recommendForYou
};
