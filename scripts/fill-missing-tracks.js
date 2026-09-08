/**
 * 补充 iTunes 未匹配到的专辑曲目
 */

const fs = require('fs');
const path = require('path');

const missingTracks = {
  'album_7yaav5': [
    'Rocks Off',
    'Rip This Joint',
    'Shake Your Hips',
    'Casino Boogie',
    'Tumbling Dice',
    'Sweet Virginia',
    'Torn and Frayed',
    'Sweet Black Angel',
    'Loving Cup',
    'Happy',
    'Turd on the Run',
    'Ventilator Blues',
    'I Just Want to See His Face',
    'Let It Loose',
    'All Down the Line',
    'Stop Breaking Down',
    'Shine a Light',
    'Soul Survivor'
  ],
  'album_yj8r78': [
    '1999',
    'Little Red Corvette',
    'Delirious',
    "Let's Pretend We're Married",
    'D.M.S.R.',
    'Automatic',
    'Something in the Water (Does Not Compute)',
    'Free',
    'Lady Cab Driver',
    'All the Critics Love U in New York',
    'International Lover'
  ],
  'album_qo0bcp': [
    'Storm',
    'Static',
    'Sleep',
    'Like Antennas to Heaven...'
  ],
  'album_4mod7a': [
    'Dance Yrself Clean',
    'Drunk Girls',
    'I Can Change',
    'You Wanted a Hit',
    'Pow Pow',
    "Somebody's Calling Me",
    'What You Need',
    'Home'
  ],
  'album_qj693t': [
    'Nikes',
    'Ivy',
    'Pink + White',
    'Be Yourself',
    'Solo',
    'Skyline To',
    'Self Control',
    'Good Guy',
    'Nights',
    'Solo (Reprise)',
    'Pretty Sweet',
    'Facebook Story',
    'Close to You',
    'White Ferrari',
    'Seigfried',
    'Godspeed',
    'Futura Free'
  ],
  'album_9b7qlm': [
    'Running Up That Hill (A Deal with God)',
    'Hounds of Love',
    'The Big Sky',
    'Mother Stands for Comfort',
    'Cloudbusting',
    'And Dream of Sheep',
    'Under Ice',
    'Waking the Witch',
    'Watching You Without Me',
    'Jig of Life',
    'Hello Earth',
    'The Morning Fog'
  ],
  'album_7dnzyn': [
    'Futile Devices',
    'Too Much',
    'Age of Adz',
    'I Walked',
    'Now That I\'m Older',
    'Get Real Get Right',
    'Bad Communication',
    'Vesuvius',
    'I Want To Be Well',
    'Impossible Soul'
  ]
};

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

  console.log('=== 补充缺失曲目 ===\n');

  let filled = 0;
  albums.forEach(album => {
    const tracks = missingTracks[album._id];
    if (tracks && tracks.length > 0) {
      album.tracks = tracks;
      filled++;
      console.log(`${album.title} - ${album.artist}: ${tracks.length} 首`);
    }
  });

  fs.writeFileSync(dataPath, JSON.stringify(albums, null, 2), 'utf8');
  console.log('\n[更新] data/albums.json');

  updateAlbumsJsFile(albums);
  updateImportDataFile(albums);

  console.log(`\n=== 完成，已补充 ${filled} 张专辑曲目 ===`);
}

main();
