/**
 * 用 Wikipedia 封面 URL 补充 iTunes 未匹配到的专辑封面
 */

const fs = require('fs');
const path = require('path');

// 缺失专辑的 Wikipedia 封面 URL（按 _id 映射）
const fallbackCovers = {
  'album_5pcgy8': 'https://upload.wikimedia.org/wikipedia/en/7/73/PublicEnemyItTakesaNationofMillionstoHoldUsBack.jpg',
  'album_2okbtk': 'https://upload.wikimedia.org/wikipedia/en/0/09/The_Strokes_-_Is_This_It.png',
  'album_zhx7zy': 'https://upload.wikimedia.org/wikipedia/en/4/42/ATribeCalledQuestTheLowEndtheory.jpg',
  'album_7yaav5': 'https://upload.wikimedia.org/wikipedia/en/8/86/ExileMainSt.jpg',
  'album_yj8r78': 'https://upload.wikimedia.org/wikipedia/en/9/9f/Prince1999.jpg',
  'album_qo0bcp': 'https://upload.wikimedia.org/wikipedia/en/5/57/Godspeed_You_Black_Emperor_-_Lift_Your_Skinny_Fists_Like_Antennas_to_Heaven.jpg',
  'album_4mod7a': 'https://upload.wikimedia.org/wikipedia/en/b/b6/LCD_Soundsystem_-_This_Is_Happening.jpg',
  'album_qj693t': 'https://upload.wikimedia.org/wikipedia/en/a/a0/Blonde_-_Frank_Ocean.jpeg',
  'album_9b7qlm': 'https://upload.wikimedia.org/wikipedia/en/8/86/Kate_Bush_-_Hounds_of_Love.png',
  'album_7dnzyn': 'https://upload.wikimedia.org/wikipedia/en/6/6f/Sufjan_Stevens_-_Age_of_Adz.jpg'
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
    return '  ' + JSON.stringify(album);
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
      console.log(`${album.title} - ${album.artist}`);
      console.log(`  ${fallbackUrl}`);
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
