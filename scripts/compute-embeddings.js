/**
 * P2: 为专辑生成特征 Embedding
 *
 * 模型：genre-feature-v1（纯本地特征，无外部 API 依赖）
 * - 特征空间 = 流派 + 情绪/标签 + 年代桶
 * - 主流派权重 1.0，次流派 0.7，mood/tags 0.5，年代 0.6
 * - 向量做 L2 归一化，余弦相似度 = 点积
 *
 * 输出：
 * - data/albums.json 就地写入 embedding 字段
 * - data/embedding-vocab.json 保存词表（保证后续重算维度一致）
 * - 同步更新 data/albums.js 与 cloudfunctions/importData/index.js
 */

const fs = require('fs');
const path = require('path');

const EMBEDDING_MODEL = 'genre-feature-v1';
const PRIMARY_GENRE_WEIGHT = 1.0;
const SECONDARY_GENRE_WEIGHT = 0.7;
const TAG_WEIGHT = 0.5;
const DECADE_WEIGHT = 0.6;

function normalizeToken(token) {
  return String(token || '').trim().toLowerCase();
}

function getDecade(year) {
  const y = Number(year);
  if (!y || isNaN(y)) return null;
  return `${Math.floor(y / 10) * 10}s`;
}

// 构建全局词表：保证每次重算时维度和顺序稳定
function buildVocab(albums) {
  const vocab = [];
  const seen = new Set();

  const push = (token) => {
    if (token && !seen.has(token)) {
      seen.add(token);
      vocab.push(token);
    }
  };

  // 先收集流派，保证流派维度在前
  albums.forEach(album => {
    (Array.isArray(album.genre) ? album.genre : []).map(normalizeToken).forEach(push);
  });
  // 再收集 mood / tags
  albums.forEach(album => {
    [...(album.mood || []), ...(album.tags || [])].map(normalizeToken).forEach(push);
  });
  // 最后是年代桶
  albums.forEach(album => {
    const decade = getDecade(album.year);
    if (decade) push(decade);
  });

  return vocab;
}

function albumToVector(album, vocabIndex) {
  const vec = new Float64Array(vocabIndex.size);

  const add = (token, weight) => {
    const idx = vocabIndex.get(token);
    if (idx !== undefined) vec[idx] += weight;
  };

  (Array.isArray(album.genre) ? album.genre : []).forEach((g, i) => {
    add(normalizeToken(g), i === 0 ? PRIMARY_GENRE_WEIGHT : SECONDARY_GENRE_WEIGHT);
  });
  [...(album.mood || []), ...(album.tags || [])].forEach(t => {
    add(normalizeToken(t), TAG_WEIGHT);
  });
  const decade = getDecade(album.year);
  if (decade) add(decade, DECADE_WEIGHT);

  // L2 归一化
  const norm = Math.sqrt(Array.from(vec).reduce((sum, v) => sum + v * v, 0));
  if (norm > 0) {
    for (let i = 0; i < vec.length; i++) vec[i] /= norm;
  }
  return Array.from(vec).map(v => Number(v.toFixed(6)));
}

function cosine(a, b) {
  let dot = 0;
  for (let i = 0; i < a.length; i++) dot += a[i] * b[i];
  return dot;
}

function updateImportDataFile(albums) {
  const filePath = path.join(__dirname, '..', 'cloudfunctions', 'importData', 'index.js');
  let content = fs.readFileSync(filePath, 'utf8');
  const newArrayString = JSON.stringify(albums, null, 2);
  const updatedContent = content.replace(
    /const DEFAULT_ALBUMS\s*=\s*\[[\s\S]*?\];/,
    `const DEFAULT_ALBUMS = \n  ${newArrayString};`
  );

  if (updatedContent === content) {
    throw new Error('未能匹配到 cloudfunctions/importData/index.js 中的 DEFAULT_ALBUMS 数组');
  }

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log('[更新] cloudfunctions/importData/index.js');
}

function updateAlbumsJsFile(albums) {
  const filePath = path.join(__dirname, '..', 'data', 'albums.js');
  const albumsString = albums.map(album => '  ' + JSON.stringify(album)).join(',\n');
  const content = `/**\n * 本地专辑数据\n * 如果没有云开发环境，可以直接使用这个文件\n */\n\nconst albums = [\n${albumsString}\n];\n\nmodule.exports = {\n  albums\n};\n`;
  fs.writeFileSync(filePath, content, 'utf8');
  console.log('[更新] data/albums.js');
}

function main() {
  const dataPath = path.join(__dirname, '..', 'data', 'albums.json');
  const albums = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`=== 生成 Embedding（${EMBEDDING_MODEL}）===\n`);
  console.log(`专辑总数: ${albums.length}`);

  const vocab = buildVocab(albums);
  const vocabIndex = new Map(vocab.map((token, idx) => [token, idx]));
  console.log(`特征维度: ${vocab.length}`);

  const computedAt = new Date().toISOString();
  let validCount = 0;
  albums.forEach(album => {
    album.embedding = albumToVector(album, vocabIndex);
    album.metadata = album.metadata || {};
    album.metadata.embeddingModel = EMBEDDING_MODEL;
    album.metadata.embeddingDim = vocab.length;
    album.metadata.embeddingAt = computedAt;
    if (album.embedding.some(v => v > 0)) validCount++;
  });

  // 相似度自检：抽样验证向量质量
  console.log('\n=== 相似度自检（每张专辑最相似的 2 张）===');
  const sample = albums.filter(a => a.embedding.some(v => v > 0)).slice(0, 5);
  sample.forEach(album => {
    const sims = albums
      .filter(other => other._id !== album._id)
      .map(other => ({ title: other.title, artist: other.artist, sim: cosine(album.embedding, other.embedding) }))
      .sort((a, b) => b.sim - a.sim)
      .slice(0, 2);
    console.log(`  ${album.title} -> ${sims.map(s => `${s.title}(${s.sim.toFixed(3)})`).join(', ')}`);
  });

  // 写回数据文件
  fs.writeFileSync(dataPath, JSON.stringify(albums, null, 2), 'utf8');
  console.log('\n[更新] data/albums.json');

  fs.writeFileSync(
    path.join(__dirname, '..', 'data', 'embedding-vocab.json'),
    JSON.stringify({ model: EMBEDDING_MODEL, vocab, computedAt }, null, 2),
    'utf8'
  );
  console.log('[更新] data/embedding-vocab.json');

  updateAlbumsJsFile(albums);
  updateImportDataFile(albums);

  console.log(`\n完成: ${validCount}/${albums.length} 张专辑拥有非零向量`);
}

main();
