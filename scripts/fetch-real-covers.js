/**
 * 自动从 MusicBrainz / Cover Art Archive 获取真实专辑封面
 * 输入：data/albums.json
 * 输出：
 *   - data/albums.json（更新 coverUrl）
 *   - data/albums.js（本地备用数据同步更新）
 *   - cloudfunctions/importData/index.js（云函数硬编码数据同步更新）
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const USER_AGENT = 'ShflMiniProgram/1.0 (your-email@example.com)';
const DELAY_MS = 1200; // MusicBrainz 建议每秒不超过 1 个请求

// 简单的 HTTPS GET 请求
function httpGet(url) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    const req = https.get(
      {
        hostname: options.hostname,
        path: options.pathname + options.search,
        headers: {
          'User-Agent': USER_AGENT,
          'Accept': 'application/json'
        }
      },
      (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => resolve({ status: res.statusCode, data }));
      }
    );
    req.on('error', reject);
    req.setTimeout(15000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 在 MusicBrainz 中搜索 release
async function searchRelease(title, artist) {
  const query = `release:"${title}" AND artist:"${artist}"`;
  const url = `https://musicbrainz.org/ws/2/release/?query=${encodeURIComponent(query)}&fmt=json`;
  const response = await httpGet(url);

  if (response.status !== 200) {
    throw new Error(`MusicBrainz 搜索失败，状态码 ${response.status}`);
  }

  const json = JSON.parse(response.data);
  if (!json.releases || json.releases.length === 0) {
    return null;
  }

  // 优先选择官方专辑（没有 "promotion"、"compilation" 等字样）
  const preferred = json.releases.find(r =>
    r.title.toLowerCase().includes(title.toLowerCase()) &&
    !/promo|sampler|compilation|best of|greatest hits/i.test(r.title)
  );

  return preferred ? preferred.id : json.releases[0].id;
}

// 从 Cover Art Archive 获取封面 URL
async function fetchCoverUrl(mbid) {
  const url = `https://coverartarchive.org/release/${mbid}`;
  const response = await httpGet(url);

  if (response.status !== 200) {
    return null;
  }

  const json = JSON.parse(response.data);
  if (!json.images || json.images.length === 0) {
    return null;
  }

  // 优先找 front=true 的图片
  const frontImage = json.images.find(img => img.front === true) || json.images[0];

  // 返回高清缩略图，没有则返回原图
  return frontImage.thumbnails?.large ||
         frontImage.thumbnails?.small ||
         frontImage.image ||
         null;
}

// 为单张专辑获取真实封面
async function fetchRealCoverForAlbum(album, index, total) {
  console.log(`[${index + 1}/${total}] 正在处理: ${album.title} - ${album.artist}`);

  try {
    const mbid = await searchRelease(album.title, album.artist);
    if (!mbid) {
      console.log(`  ⚠️ 未找到 MusicBrainz 记录`);
      return { success: false, reason: '未找到 MusicBrainz 记录' };
    }

    const coverUrl = await fetchCoverUrl(mbid);
    if (!coverUrl) {
      console.log(`  ⚠️ 未找到封面图片`);
      return { success: false, reason: '未找到封面图片' };
    }

    console.log(`  ✅ 已获取封面: ${coverUrl}`);
    return { success: true, coverUrl };
  } catch (err) {
    console.log(`  ❌ 出错: ${err.message}`);
    return { success: false, reason: err.message };
  }
}

// 同步更新 cloudfunctions/importData/index.js 中的 albums 数组
function updateImportDataFile(albums) {
  const filePath = path.join(__dirname, '..', 'cloudfunctions', 'importData', 'index.js');
  let content = fs.readFileSync(filePath, 'utf8');

  // 使用 JSON.stringify 生成新的数组字符串
  const newArrayString = JSON.stringify(albums, null, 2);

  // 替换 const albums = [...];
  const updatedContent = content.replace(
    /const albums\s*=\s*\[[\s\S]*?\];/,
    `const albums = \n  ${newArrayString};`
  );

  if (updatedContent === content) {
    throw new Error('未能匹配到 cloudfunctions/importData/index.js 中的 albums 数组');
  }

  fs.writeFileSync(filePath, updatedContent, 'utf8');
  console.log('[更新] cloudfunctions/importData/index.js');
}

// 同步更新 data/albums.js
function updateAlbumsJsFile(albums) {
  const filePath = path.join(__dirname, '..', 'data', 'albums.js');

  const albumsString = albums.map(album => {
    const entries = Object.entries(album)
      .map(([key, value]) => {
        if (typeof value === 'string') {
          return `${key}:"${value.replace(/"/g, '\\"')}"`;
        }
        return `${key}:${value}`;
      })
      .join(',');
    return `  {${entries}}`;
  }).join(',\n');

  const content = `/**\n * 本地专辑数据\n * 如果没有云开发环境，可以直接使用这个文件\n */\n\nconst albums = [\n${albumsString}\n];\n\nmodule.exports = {\n  albums\n};\n`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('[更新] data/albums.js');
}

// 主函数
async function main() {
  const dataPath = path.join(__dirname, '..', 'data', 'albums.json');
  const albums = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`=== 开始获取真实专辑封面，共 ${albums.length} 张 ===\n`);

  const missing = [];

  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    const result = await fetchRealCoverForAlbum(album, i, albums.length);

    if (result.success) {
      album.coverUrl = result.coverUrl;
    } else {
      missing.push({
        _id: album._id,
        title: album.title,
        artist: album.artist,
        reason: result.reason
      });
    }

    // 控制请求频率
    if (i < albums.length - 1) {
      await delay(DELAY_MS);
    }
  }

  // 保存 albums.json
  fs.writeFileSync(dataPath, JSON.stringify(albums, null, 2), 'utf8');
  console.log('\n[更新] data/albums.json');

  // 同步更新其他文件
  updateAlbumsJsFile(albums);
  updateImportDataFile(albums);

  // 输出统计
  console.log('\n=== 完成 ===');
  console.log(`成功: ${albums.length - missing.length}/${albums.length}`);

  if (missing.length > 0) {
    console.log(`\n缺失封面的专辑（${missing.length} 张）：`);
    missing.forEach(item => {
      console.log(`  - ${item.title} / ${item.artist} (${item.reason})`);
    });

    // 保存缺失清单
    const missingPath = path.join(__dirname, '..', 'data', 'missing-covers.json');
    fs.writeFileSync(missingPath, JSON.stringify(missing, null, 2), 'utf8');
    console.log(`\n缺失清单已保存: ${missingPath}`);
  }
}

main().catch(err => {
  console.error('脚本运行失败:', err);
  process.exit(1);
});
