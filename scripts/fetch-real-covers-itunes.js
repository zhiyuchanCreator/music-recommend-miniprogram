/**
 * 使用 iTunes API 获取真实专辑封面与曲目
 * 策略：按 artist 搜索该艺术家的所有专辑，再按 title 匹配，然后 lookup 曲目
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DELAY_MS = 300;

function httpGet(url) {
  return new Promise((resolve, reject) => {
    const options = new URL(url);
    const req = https.get(
      {
        hostname: options.hostname,
        path: options.pathname + options.search,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0',
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
    req.setTimeout(20000, () => {
      req.destroy();
      reject(new Error('请求超时'));
    });
  });
}

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 按艺术家搜索专辑
async function searchAlbumsByArtist(artist) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(artist)}&entity=album&attribute=artistTerm&limit=200`;
  const response = await httpGet(url);

  if (response.status !== 200) {
    throw new Error(`iTunes 请求失败，状态码 ${response.status}`);
  }

  const json = JSON.parse(response.data);
  return json.results || [];
}

// 在结果中匹配专辑标题
function matchAlbum(results, title) {
  const normalizedTitle = title.toLowerCase().replace(/[^a-z0-9]/g, '');

  return results.find(item => {
    const itemTitle = (item.collectionName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
    return itemTitle.includes(normalizedTitle) || normalizedTitle.includes(itemTitle);
  });
}

// 获取高清封面（把 100x100 替换成 1000x1000）
function getHighResCover(url100) {
  if (!url100) return null;
  // iTunes artworkUrl100 结尾是 /100x100bb.jpg，改成 /1000x1000bb.jpg
  return url100.replace(/\/\d+x\d+bb\.jpg$/, '/1000x1000bb.jpg');
}

// 根据 collectionId 获取曲目列表
async function fetchTracks(collectionId) {
  const url = `https://itunes.apple.com/lookup?id=${collectionId}&entity=song&limit=200`;
  const response = await httpGet(url);

  if (response.status !== 200) {
    throw new Error(`iTunes 曲目请求失败，状态码 ${response.status}`);
  }

  const json = JSON.parse(response.data);
  const tracks = (json.results || [])
    .filter(item => item.wrapperType === 'track' && item.trackName)
    .sort((a, b) => a.trackNumber - b.trackNumber)
    .map(item => item.trackName);

  return tracks;
}

// 同步更新 cloudfunctions/importData/index.js 中的 albums 数组
function updateImportDataFile(albums) {
  const filePath = path.join(__dirname, '..', 'cloudfunctions', 'importData', 'index.js');
  let content = fs.readFileSync(filePath, 'utf8');
  const newArrayString = JSON.stringify(albums, null, 2);
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

  // 使用 JSON.stringify 保证数组、字符串、数字格式正确
  const albumsString = albums.map(album => {
    return '  ' + JSON.stringify(album);
  }).join(',\n');

  const content = `/**\n * 本地专辑数据\n * 如果没有云开发环境，可以直接使用这个文件\n */\n\nconst albums = [\n${albumsString}\n];\n\nmodule.exports = {\n  albums\n};\n`;

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('[更新] data/albums.js');
}

async function main() {
  const dataPath = path.join(__dirname, '..', 'data', 'albums.json');
  const albums = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log(`=== 开始从 iTunes 获取真实封面，共 ${albums.length} 张 ===\n`);

  // 按艺术家缓存搜索结果
  const artistCache = {};
  const missing = [];

  for (let i = 0; i < albums.length; i++) {
    const album = albums[i];
    console.log(`[${i + 1}/${albums.length}] 正在处理: ${album.title} - ${album.artist}`);

    try {
      if (!artistCache[album.artist]) {
        console.log(`  首次搜索艺术家: ${album.artist}`);
        artistCache[album.artist] = await searchAlbumsByArtist(album.artist);
        console.log(`  找到 ${artistCache[album.artist].length} 张专辑`);
      }

      const match = matchAlbum(artistCache[album.artist], album.title);

      if (match && match.artworkUrl100) {
        const coverUrl = getHighResCover(match.artworkUrl100);
        album.coverUrl = coverUrl;
        console.log(`  已获取封面: ${coverUrl}`);

        // 如果已有曲目数据且不为空，则保留；否则尝试从 iTunes 拉取
        if (!album.tracks || album.tracks.length === 0) {
          try {
            const tracks = await fetchTracks(match.collectionId);
            if (tracks.length > 0) {
              album.tracks = tracks;
              console.log(`  已获取 ${tracks.length} 首曲目`);
            }
          } catch (trackErr) {
            console.log(`  曲目获取失败: ${trackErr.message}`);
          }
        }
      } else {
        missing.push({ _id: album._id, title: album.title, artist: album.artist, reason: '未匹配到专辑' });
        console.log(`  未匹配到专辑`);
      }
    } catch (err) {
      missing.push({ _id: album._id, title: album.title, artist: album.artist, reason: err.message });
      console.log(`  出错: ${err.message}`);
    }

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

    const missingPath = path.join(__dirname, '..', 'data', 'missing-covers.json');
    fs.writeFileSync(missingPath, JSON.stringify(missing, null, 2), 'utf8');
    console.log(`\n缺失清单已保存: ${missingPath}`);
  }
}

main().catch(err => {
  console.error('脚本运行失败:', err);
  process.exit(1);
});
