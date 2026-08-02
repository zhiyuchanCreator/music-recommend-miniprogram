/**
 * 补充获取缺失的真实专辑封面
 * 策略：用专辑名全局搜索，匹配更宽松，延迟更大
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

const DELAY_MS = 2500;

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

async function searchAlbumsByTitle(title) {
  const url = `https://itunes.apple.com/search?term=${encodeURIComponent(title)}&entity=album&limit=200`;
  const response = await httpGet(url);

  if (response.status !== 200) {
    throw new Error(`iTunes 请求失败，状态码 ${response.status}`);
  }

  const json = JSON.parse(response.data);
  return json.results || [];
}

function normalize(str) {
  return (str || '').toLowerCase()
    .replace(/[^a-z0-9]/g, '')
    .replace(/the/g, '');
}

function matchAlbum(results, title, artist) {
  const normalizedTitle = normalize(title);
  const normalizedArtist = normalize(artist);

  // 先精确匹配标题+艺术家
  let match = results.find(item => {
    const itemTitle = normalize(item.collectionName);
    const itemArtist = normalize(item.artistName);
    return itemTitle === normalizedTitle &&
           (itemArtist.includes(normalizedArtist) || normalizedArtist.includes(itemArtist));
  });

  if (match) return match;

  // 再模糊匹配标题
  match = results.find(item => {
    const itemTitle = normalize(item.collectionName);
    return itemTitle.includes(normalizedTitle) || normalizedTitle.includes(itemTitle);
  });

  return match;
}

function getHighResCover(url100) {
  if (!url100) return null;
  return url100.replace(/\/\d+x\d+bb\.jpg$/, '/1000x1000bb.jpg');
}

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

async function main() {
  const dataPath = path.join(__dirname, '..', 'data', 'albums.json');
  const missingPath = path.join(__dirname, '..', 'data', 'missing-covers.json');

  const albums = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
  const missingList = JSON.parse(fs.readFileSync(missingPath, 'utf8'));

  console.log(`=== 补充获取缺失封面，共 ${missingList.length} 张 ===\n`);

  const stillMissing = [];

  for (let i = 0; i < missingList.length; i++) {
    const missing = missingList[i];
    const album = albums.find(a => a._id === missing._id);

    if (!album) {
      stillMissing.push(missing);
      continue;
    }

    console.log(`[${i + 1}/${missingList.length}] 补充: ${album.title} - ${album.artist}`);

    try {
      const results = await searchAlbumsByTitle(album.title);
      console.log(`  📦 找到 ${results.length} 张专辑`);

      const match = matchAlbum(results, album.title, album.artist);

      if (match && match.artworkUrl100) {
        const coverUrl = getHighResCover(match.artworkUrl100);
        album.coverUrl = coverUrl;
        console.log(`  ✅ 已获取封面: ${coverUrl}`);
      } else {
        stillMissing.push({ ...missing, reason: '未匹配到专辑' });
        console.log(`  ⚠️ 未匹配到专辑`);
      }
    } catch (err) {
      stillMissing.push({ ...missing, reason: err.message });
      console.log(`  ❌ 出错: ${err.message}`);
    }

    if (i < missingList.length - 1) {
      await delay(DELAY_MS);
    }
  }

  // 保存 albums.json
  fs.writeFileSync(dataPath, JSON.stringify(albums, null, 2), 'utf8');
  console.log('\n[更新] data/albums.json');

  // 同步更新其他文件
  updateAlbumsJsFile(albums);
  updateImportDataFile(albums);

  // 更新缺失清单
  if (stillMissing.length > 0) {
    fs.writeFileSync(missingPath, JSON.stringify(stillMissing, null, 2), 'utf8');
    console.log(`\n仍有 ${stillMissing.length} 张缺失：`);
    stillMissing.forEach(item => {
      console.log(`  - ${item.title} / ${item.artist} (${item.reason})`);
    });
    console.log(`\n缺失清单已更新: ${missingPath}`);
  } else {
    if (fs.existsSync(missingPath)) {
      fs.unlinkSync(missingPath);
    }
    console.log('\n🎉 所有专辑封面已获取完成！');
  }
}

main().catch(err => {
  console.error('脚本运行失败:', err);
  process.exit(1);
});
