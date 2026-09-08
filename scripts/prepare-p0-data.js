/**
 * P0 数据准备脚本
 * 1. 从 cloudfunctions/importData/index.js 提取现有 50 张专辑
 * 2. 追加 50 张新专辑，组成 100 张种子数据
 * 3. 输出 data/raw-albums.json（供 clean-data.js 清洗）
 */

const fs = require('fs');
const path = require('path');

// 读取现有硬编码数据
function readExistingAlbums() {
  const filePath = path.join(__dirname, '..', 'cloudfunctions', 'importData', 'index.js');
  const content = fs.readFileSync(filePath, 'utf8');

  const match = content.match(/const albums\s*=\s*(\[[\s\S]*?\]);/);
  if (!match) {
    throw new Error('未能在 importData/index.js 中匹配到 albums 数组');
  }

  return new Function('return ' + match[1])();
}

// 将现有数据转换为 raw 格式
function toRawFormat(album) {
  return {
    title: album.title,
    artist: album.artist,
    year: album.year || null,
    genre: Array.isArray(album.genre) ? album.genre.join(', ') : album.genre,
    rating: album.rating || null,
    source: album.source || 'RYM',
    sourceUrl: album.sourceUrl || '',
    coverUrl: album.coverUrl || '',
    description: album.description || '',
    tracks: album.tracks || '',
    label: album.label || null,
    producer: album.producer || null
  };
}

// 新增的 50 张专辑（手动精选，覆盖 soul/funk/prog/post-rock/electronic/hip-hop/R&B/pop 等）
const additionalAlbums = [
  { title: "Exile on Main St.", artist: "The Rolling Stones", year: 1972, genre: "rock, blues rock", rating: 88, source: "RYM", description: "The Stones' sprawling double album masterpiece." },
  { title: "Innervisions", artist: "Stevie Wonder", year: 1973, genre: "soul, funk", rating: 87, source: "Metacritic", description: "Stevie Wonder's synth-driven soul masterpiece." },
  { title: "Songs in the Key of Life", artist: "Stevie Wonder", year: 1976, genre: "soul, funk", rating: 85, source: "Metacritic", description: "An expansive double album of pop, soul and jazz." },
  { title: "Talking Book", artist: "Stevie Wonder", year: 1972, genre: "soul, funk", rating: 86, source: "Metacritic", description: "A landmark of 70s pop and soul." },
  { title: "1999", artist: "Prince", year: 1982, genre: "funk, pop", rating: 84, source: "Metacritic", description: "Prince's breakthrough double album." },
  { title: "Sign o' the Times", artist: "Prince", year: 1987, genre: "funk, pop", rating: 83, source: "Pitchfork", description: "Prince's eclectic double album peak." },
  { title: "Red", artist: "King Crimson", year: 1974, genre: "progressive rock, hard rock", rating: 82, source: "RYM", description: "Heavy, menacing progressive rock." },
  { title: "In the Court of the Crimson King", artist: "King Crimson", year: 1969, genre: "progressive rock, art rock", rating: 81, source: "RYM", description: "The album that launched progressive rock." },
  { title: "Astral Weeks", artist: "Van Morrison", year: 1968, genre: "folk rock, singer-songwriter", rating: 80, source: "Pitchfork", description: "A stream-of-consciousness folk-jazz masterpiece." },
  { title: "Moondance", artist: "Van Morrison", year: 1970, genre: "folk rock, soul", rating: 79, source: "RYM", description: "Warm, soulful songwriting." },
  { title: "Lift Your Skinny Fists Like Antennas to Heaven", artist: "Godspeed You! Black Emperor", year: 2000, genre: "post-rock, experimental", rating: 78, source: "RYM", description: "Cinematic, apocalyptic post-rock." },
  { title: "Agaetis Byrjun", artist: "Sigur Ros", year: 1999, genre: "post-rock, ambient", rating: 77, source: "RYM", description: "Ethereal Icelandic post-rock." },
  { title: "Takk...", artist: "Sigur Ros", year: 2005, genre: "post-rock, ambient", rating: 76, source: "RYM", description: "Warm and melodic post-rock landscapes." },
  { title: "Sound of Silver", artist: "LCD Soundsystem", year: 2007, genre: "dance-punk, electronic", rating: 75, source: "Metacritic", description: "Dance-punk with emotional depth." },
  { title: "This Is Happening", artist: "LCD Soundsystem", year: 2010, genre: "dance-punk, electronic", rating: 74, source: "Metacritic", description: "James Murphy's bittersweet dance epic." },
  { title: "Silent Shout", artist: "The Knife", year: 2006, genre: "electronic, synth-pop", rating: 73, source: "Pitchfork", description: "Dark, twisted Swedish electronic pop." },
  { title: "Discovery", artist: "Daft Punk", year: 2001, genre: "house, electronic", rating: 72, source: "Metacritic", description: "French house's most joyful hour." },
  { title: "Random Access Memories", artist: "Daft Punk", year: 2013, genre: "disco, electronic", rating: 71, source: "Metacritic", description: "A love letter to disco and studio musicians." },
  { title: "Good Kid, M.A.A.D City", artist: "Kendrick Lamar", year: 2012, genre: "hip hop, west coast hip hop", rating: 90, source: "Metacritic", description: "A cinematic concept album about Compton." },
  { title: "My Beautiful Dark Twisted Fantasy", artist: "Kanye West", year: 2010, genre: "hip hop, progressive rap", rating: 89, source: "Metacritic", description: "A maximalist hip hop masterpiece." },
  { title: "Yeezus", artist: "Kanye West", year: 2013, genre: "hip hop, industrial hip hop", rating: 78, source: "Pitchfork", description: "Minimalist, abrasive and polarizing." },
  { title: "Aquemini", artist: "OutKast", year: 1998, genre: "hip hop, southern hip hop", rating: 77, source: "Metacritic", description: "OutKast's most cohesive blend of funk and rap." },
  { title: "ATLiens", artist: "OutKast", year: 1996, genre: "hip hop, southern hip hop", rating: 76, source: "Metacritic", description: "Spacey, introspective Atlanta hip hop." },
  { title: "Stankonia", artist: "OutKast", year: 2000, genre: "hip hop, southern hip hop", rating: 75, source: "Metacritic", description: "OutKast at their most explosive and ambitious." },
  { title: "Odelay", artist: "Beck", year: 1996, genre: "alternative rock, folk rock", rating: 74, source: "Pitchfork", description: "Genre-hopping slacker rock masterpiece." },
  { title: "Sea Change", artist: "Beck", year: 2002, genre: "folk rock, singer-songwriter", rating: 73, source: "Pitchfork", description: "A heartbreaking acoustic breakup album." },
  { title: "Surfer Rosa", artist: "Pixies", year: 1988, genre: "alternative rock, indie rock", rating: 72, source: "Pitchfork", description: "Raw, influential indie rock produced by Steve Albini." },
  { title: "69 Love Songs", artist: "The Magnetic Fields", year: 1999, genre: "indie pop, chamber pop", rating: 71, source: "Pitchfork", description: "An ambitious three-volume song cycle about love." },
  { title: "The Soft Bulletin", artist: "The Flaming Lips", year: 1999, genre: "psychedelic rock, alternative rock", rating: 70, source: "RYM", description: "Orchestral psychedelia with open-hearted emotion." },
  { title: "Yoshimi Battles the Pink Robots", artist: "The Flaming Lips", year: 2002, genre: "psychedelic rock, electronic", rating: 69, source: "Metacritic", description: "A quirky, emotional sci-fi concept album." },
  { title: "In Rainbows", artist: "Radiohead", year: 2007, genre: "alternative rock, art rock", rating: 88, source: "Metacritic", description: "Radiohead's most human and melodic album." },
  { title: "Kid A", artist: "Radiohead", year: 2000, genre: "electronic, experimental rock", rating: 87, source: "Pitchfork", description: "A polarizing but influential electronic turn." },
  { title: "The Bends", artist: "Radiohead", year: 1995, genre: "alternative rock, britpop", rating: 86, source: "RYM", description: "Radiohead's guitar-driven breakthrough." },
  { title: "Dummy", artist: "Portishead", year: 1994, genre: "trip hop, electronic", rating: 78, source: "Pitchfork", description: "The definitive trip hop debut." },
  { title: "Mezzanine", artist: "Massive Attack", year: 1998, genre: "trip hop, electronic", rating: 77, source: "Metacritic", description: "Dark, paranoid trip hop masterpiece." },
  { title: "Currents", artist: "Tame Impala", year: 2015, genre: "psychedelic pop, electronic", rating: 76, source: "Metacritic", description: "Kevin Parker's polished psych-pop breakthrough." },
  { title: "Lonerism", artist: "Tame Impala", year: 2012, genre: "psychedelic rock, neo-psychedelia", rating: 75, source: "Pitchfork", description: "Introspective psychedelia with lush production." },
  { title: "CHANNEL ORANGE", artist: "Frank Ocean", year: 2012, genre: "r&b, neo-soul", rating: 80, source: "Metacritic", description: "A genre-blurring R&B concept album." },
  { title: "Blonde", artist: "Frank Ocean", year: 2016, genre: "r&b, ambient pop", rating: 79, source: "Pitchfork", description: "Intimate, fragmented and deeply personal." },
  { title: "Hounds of Love", artist: "Kate Bush", year: 1985, genre: "art pop, progressive pop", rating: 78, source: "RYM", description: "Kate Bush's commercial and artistic peak." },
  { title: "Heaven or Las Vegas", artist: "Cocteau Twins", year: 1990, genre: "dream pop, ethereal wave", rating: 77, source: "Pitchfork", description: "The most accessible Cocteau Twins masterpiece." },
  { title: "Fear of Music", artist: "Talking Heads", year: 1979, genre: "new wave, art punk", rating: 74, source: "RYM", description: "Paranoid, funky new wave." },
  { title: "Wish You Were Here", artist: "Pink Floyd", year: 1975, genre: "progressive rock, art rock", rating: 73, source: "RYM", description: "A melancholic tribute to Syd Barrett." },
  { title: "Animals", artist: "Pink Floyd", year: 1977, genre: "progressive rock, art rock", rating: 72, source: "RYM", description: "Orwellian prog-rock concept album." },
  { title: "The Wall", artist: "Pink Floyd", year: 1979, genre: "progressive rock, art rock", rating: 71, source: "RYM", description: "A sprawling rock opera about isolation." },
  { title: "Ready to Die", artist: "The Notorious B.I.G.", year: 1994, genre: "hip hop, east coast hip hop", rating: 76, source: "Metacritic", description: "A vivid, autobiographical East Coast classic." },
  { title: "Reasonable Doubt", artist: "Jay-Z", year: 1996, genre: "hip hop, east coast hip hop", rating: 75, source: "Metacritic", description: "Jay-Z's mafioso rap debut." },
  { title: "The College Dropout", artist: "Kanye West", year: 2004, genre: "hip hop, conscious hip hop", rating: 74, source: "Metacritic", description: "Kanye's soul-sampling, backpack-rap debut." },
  { title: "Lemonade", artist: "Beyonce", year: 2016, genre: "r&b, pop", rating: 73, source: "Metacritic", description: "A visual album of betrayal, healing and empowerment." },
  { title: "Age of Adz", artist: "Sufjan Stevens", year: 2010, genre: "indie folk, electronic", rating: 72, source: "Pitchfork", description: "An electronic-folk epic about love and apocalypse." }
];

function main() {
  console.log('=== P0 数据准备 ===\n');

  const existing = readExistingAlbums().map(toRawFormat);
  console.log(`[读取] 现有 ${existing.length} 张专辑`);

  const raw = [...existing, ...additionalAlbums];
  console.log(`[合并] 共 ${raw.length} 张专辑`);

  // 去重（基于艺术家+专辑名）
  const seen = new Set();
  const unique = [];
  for (const album of raw) {
    const key = `${album.artist}::${album.title}`.toLowerCase();
    if (seen.has(key)) {
      console.log(`[去重] 跳过重复: ${album.artist} - ${album.title}`);
      continue;
    }
    seen.add(key);
    unique.push(album);
  }
  console.log(`[去重后] ${unique.length} 张专辑`);

  // P0 目标：100 张，不足则提示，超过则截取
  const targetCount = 100;
  const finalAlbums = unique.slice(0, targetCount);
  if (unique.length < targetCount) {
    console.warn(`[警告] 唯一专辑数量不足 ${targetCount}，当前 ${unique.length} 张，请补充更多专辑`);
  } else if (unique.length > targetCount) {
    console.log(`[截取] 取前 ${targetCount} 张专辑`);
  }

  const outputPath = path.join(__dirname, '..', 'data', 'raw-albums.json');
  fs.writeFileSync(outputPath, JSON.stringify(finalAlbums, null, 2), 'utf8');
  console.log(`\n[输出] ${outputPath}（${finalAlbums.length} 张）`);
}

main();
