/**
 * 用 Wikipedia 封面 URL 补充缺失的专辑封面
 */

const fs = require('fs');
const path = require('path');

// 缺失专辑的 Wikipedia 封面 URL
const fallbackCovers = {
  'album_014': 'https://upload.wikimedia.org/wikipedia/en/b/b7/NirvanaNevermindalbumcover.jpg',
  'album_030': 'https://upload.wikimedia.org/wikipedia/en/7/73/PublicEnemyItTakesaNationofMillionstoHoldUsBack.jpg',
  'album_039': 'https://upload.wikimedia.org/wikipedia/en/a/af/Slint_-_Spiderland_album_cover.png',
  'album_041': 'https://upload.wikimedia.org/wikipedia/en/4/42/ATribeCalledQuestTheLowEndtheory.jpg'
};

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

function main() {
  const dataPath = path.join(__dirname, '..', 'data', 'albums.json');
  const albums = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

  console.log('=== 补充缺失封面 ===\n');

  let filled = 0;
  albums.forEach(album => {
    const fallbackUrl = fallbackCovers[album._id];
    if (fallbackUrl) {
      album.coverUrl = fallbackUrl;
      filled++;
      console.log(`✅ ${album.title} - ${album.artist}`);
      console.log(`   ${fallbackUrl}`);
    }
  });

  fs.writeFileSync(dataPath, JSON.stringify(albums, null, 2), 'utf8');
  console.log('\n[更新] data/albums.json');

  updateAlbumsJsFile(albums);
  updateImportDataFile(albums);

  // 删除缺失清单
  const missingPath = path.join(__dirname, '..', 'data', 'missing-covers.json');
  if (fs.existsSync(missingPath)) {
    fs.unlinkSync(missingPath);
    console.log('[清理] data/missing-covers.json');
  }

  console.log(`\n=== 完成，已补充 ${filled} 张封面 ===`);
}

main();
