/**
 * 数据清洗脚本：清洗、统一字段、去重
 * 输入：raw-albums.json
 * 输出：albums.json（标准数组）
 */

const fs = require('fs');
const path = require('path');

// 读取原始数据
function readRawData() {
  const inputPath = path.join(__dirname, '..', 'data', 'raw-albums.json');

  if (!fs.existsSync(inputPath)) {
    throw new Error(`找不到原始数据文件: ${inputPath}`);
  }

  const data = fs.readFileSync(inputPath, 'utf8');
  return JSON.parse(data);
}

// 清洗专辑标题
function cleanTitle(title) {
  if (!title) return '';

  return title
    .replace(/\s+/g, ' ')           // 合并多个空格
    .replace(/^[\s\-–—]+|[\s\-–—]+$/g, '') // 去除首尾空格和横线
    .trim();
}

// 清洗艺术家名称
function cleanArtist(artist) {
  if (!artist) return 'Unknown Artist';

  return artist
    .replace(/\s+/g, ' ')
    .replace(/^[\s\-–—]+|[\s\-–—]+$/g, '')
    .trim();
}

// 生成唯一ID
function generateId(album) {
  const str = `${album.artist}-${album.title}`.toLowerCase();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return `album_${Math.abs(hash).toString(36)}`;
}

// 把风格统一为数组
function normalizeGenre(genre) {
  if (Array.isArray(genre)) {
    return genre.map(g => g.trim()).filter(Boolean);
  }
  if (typeof genre === 'string') {
    return genre.split(/[,|/]/).map(g => g.trim()).filter(Boolean);
  }
  return [];
}

// 把曲目统一为数组
function normalizeTracks(tracks) {
  if (Array.isArray(tracks)) {
    return tracks.map(t => t.trim()).filter(Boolean);
  }
  if (typeof tracks === 'string') {
    return tracks.split(/[|]/).map(t => t.trim()).filter(Boolean);
  }
  return [];
}

// 标准化专辑数据
function normalizeAlbum(rawAlbum) {
  const title = cleanTitle(rawAlbum.title);
  const artist = cleanArtist(rawAlbum.artist);

  return {
    _id: generateId({ artist, title }),
    title: title,
    artist: artist,
    year: rawAlbum.year || null,
    genre: normalizeGenre(rawAlbum.genre),
    rating: typeof rawAlbum.rating === 'number' ? rawAlbum.rating : null,
    source: rawAlbum.source || 'Unknown',
    sourceUrl: rawAlbum.sourceUrl || '',
    coverUrl: rawAlbum.coverUrl || '',
    description: rawAlbum.description || '',
    tracks: normalizeTracks(rawAlbum.tracks),
    label: rawAlbum.label || null,
    producer: rawAlbum.producer || null,
    duration: rawAlbum.duration || null,
    mood: normalizeGenre(rawAlbum.mood),
    energy: typeof rawAlbum.energy === 'number' ? rawAlbum.energy : null,
    bpm: typeof rawAlbum.bpm === 'number' ? rawAlbum.bpm : null,
    tags: normalizeGenre(rawAlbum.tags),
    culturalContext: rawAlbum.culturalContext || null,
    embedding: Array.isArray(rawAlbum.embedding) ? rawAlbum.embedding : null,
    metadata: {
      crawledAt: rawAlbum.crawledAt || new Date().toISOString(),
      cleanedAt: new Date().toISOString(),
      importBatch: rawAlbum.importBatch || 'p0'
    }
  };
}

// 去重（基于艺术家+专辑名）
function removeDuplicates(albums) {
  const seen = new Set();
  const unique = [];

  for (const album of albums) {
    const key = `${album.artist}-${album.title}`.toLowerCase();

    if (!seen.has(key) && album.title && album.artist !== 'Unknown Artist') {
      seen.add(key);
      unique.push(album);
    } else if (seen.has(key)) {
      console.log(`[去重] 跳过重复: ${album.artist} - ${album.title}`);
    }
  }

  return unique;
}

// 数据验证
function validateAlbum(album) {
  const errors = [];

  if (!album.title || album.title.length < 1) {
    errors.push('标题为空');
  }

  if (!album.artist || album.artist === 'Unknown Artist') {
    errors.push('艺术家未知');
  }

  if (album.title && album.title.length > 200) {
    errors.push('标题过长');
  }

  return errors;
}

// 主函数
function main() {
  console.log('=== 开始清洗数据 ===\n');

  try {
    // 1. 读取原始数据
    console.log('[1/4] 读取原始数据...');
    const rawData = readRawData();
    console.log(`   读取到 ${rawData.length} 条原始数据`);

    // 2. 标准化数据
    console.log('[2/4] 标准化数据...');
    const normalized = rawData.map(normalizeAlbum);
    console.log(`   标准化完成`);

    // 3. 去重
    console.log('[3/4] 去重处理...');
    const unique = removeDuplicates(normalized);
    console.log(`   去重后剩余 ${unique.length} 条数据`);

    // 4. 验证并过滤
    console.log('[4/4] 验证数据...');
    const valid = [];
    const invalid = [];

    for (const album of unique) {
      const errors = validateAlbum(album);
      if (errors.length === 0) {
        valid.push(album);
      } else {
        invalid.push({ album, errors });
        console.log(`   [无效] ${album.artist} - ${album.title}: ${errors.join(', ')}`);
      }
    }

    console.log(`   有效数据: ${valid.length} 条`);
    console.log(`   无效数据: ${invalid.length} 条`);

    // 5. 保存清洗后的数据
    const outputDir = path.join(__dirname, '..', 'data');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    const outputPath = path.join(outputDir, 'albums.json');
    fs.writeFileSync(outputPath, JSON.stringify(valid, null, 2), 'utf8');

    // 6. 保存统计信息
    const stats = {
      total: rawData.length,
      normalized: normalized.length,
      unique: unique.length,
      valid: valid.length,
      invalid: invalid.length,
      bySource: {}
    };

    // 按来源统计
    for (const album of valid) {
      const source = album.source;
      stats.bySource[source] = (stats.bySource[source] || 0) + 1;
    }

    const statsPath = path.join(outputDir, 'stats.json');
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2), 'utf8');

    console.log(`\n=== 清洗完成 ===`);
    console.log(`- 原始数据: ${rawData.length} 条`);
    console.log(`- 有效数据: ${valid.length} 条`);
    console.log(`- 去重: ${normalized.length - unique.length} 条`);
    console.log(`- 无效: ${invalid.length} 条`);
    console.log(`\n按来源统计:`);
    for (const [source, count] of Object.entries(stats.bySource)) {
      console.log(`  - ${source}: ${count} 条`);
    }
    console.log(`\n输出文件:`);
    console.log(`- ${outputPath}`);
    console.log(`- ${statsPath}`);

  } catch (err) {
    console.error('清洗过程出错:', err.message);
    process.exit(1);
  }
}

// 运行
main();
