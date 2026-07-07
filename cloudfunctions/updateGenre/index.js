const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

// 专辑 genre 数据映射（以 title 为 key，匹配云数据库中的记录）
const genreMap = 
{
  'The Dark Side of the Moon': 'rock, progressive rock',
  'Kind of Blue': 'jazz, modal jazz',
  'Abbey Road': 'rock, pop',
  'OK Computer': 'alternative rock, art rock',
  'Illmatic': 'hip hop, east coast hip hop',
  'Loveless': 'shoegaze, noise pop',
  'Madvillainy': 'hip hop, alternative hip hop',
  'In the Aeroplane Over the Sea': 'indie rock, folk',
  'To Pimp a Butterfly': 'hip hop, jazz rap',
  'Pet Sounds': 'pop, baroque pop',
  'Revolver': 'rock, psychedelic rock',
  'Highway 61 Revisited': 'folk rock, blues rock',
  'Thriller': 'pop, r&b',
  'Nevermind': 'grunge, alternative rock',
  'Remain in Light': 'new wave, art pop',
  'The Rise and Fall of Ziggy Stardust': 'glam rock, art rock',
  'A Love Supreme': 'jazz, modal jazz',
  'Unknown Pleasures': 'post-punk, gothic rock',
  'Purple Rain': 'pop, funk',
  "Enter the Wu-Tang": 'hip hop, hardcore hip hop',
  "Sgt. Pepper's Lonely Hearts Club Band": 'rock, psychedelic rock',
  "What's Going On": 'soul, r&b',
  'Blood on the Tracks': 'folk rock, singer-songwriter',
  "The Velvet Underground & Nico": 'art rock, experimental',
  'London Calling': 'punk, new wave',
  'Blonde on Blonde': 'folk rock, blues rock',
  'The Queen Is Dead': 'indie rock, alternative rock',
  'Blue': 'folk, singer-songwriter',
  'Led Zeppelin IV': 'hard rock, folk rock',
  'It Takes a Nation of Millions to Hold Us Back': 'hip hop, political hip hop',
  'The Stone Roses': 'indie rock, baggy',
  'Disintegration': 'gothic rock, post-punk',
  'Doolittle': 'alternative rock, indie rock',
  'Marquee Moon': 'art punk, post-punk',
  'Transformer': 'glam rock, art rock',
  'Harvest': 'folk rock, country rock',
  'Is This It': 'indie rock, garage rock',
  'Bitches Brew': 'jazz fusion, experimental',
  'Spiderland': 'post-rock, math rock',
  'Daydream Nation': 'noise rock, alternative rock',
  'The Low End Theory': 'hip hop, jazz rap',
  'Horses': 'punk rock, art punk',
  "Selected Ambient Works 85-92": 'ambient, electronic',
  'Grace': 'alternative rock, folk rock',
  'Electric Ladyland': 'psychedelic rock, blues rock',
  'Closer': 'post-punk, gothic rock',
  'Blue Lines': 'trip hop, electronic',
  'Rumours': 'pop rock, soft rock',
  "Entertainment!": 'post-punk, funk',
  'Homogenic': 'electronic, art pop'
}


exports.main = async (event, context) => {
  console.log('[更新Genre] 开始更新专辑类型...');

  try {
    // 获取所有专辑
    const { data } = await db.collection('albums').get();

    if (data.length === 0) {
      return { success: false, message: '数据库为空' };
    }

    let updated = 0;
    let skipped = 0;

    // 根据 title 匹配并更新 genre
    for (const album of data) {
      const genres = genreMap[album.title];
      if (genres) {
        await db.collection('albums').doc(album._id).update({
          data: { genre: genres }
        });
        updated++;
        console.log(`[更新Genre] 更新: ${album.title}`);
      } else {
        skipped++;
        console.log(`[更新Genre] 跳过（无匹配）: ${album.title}`);
      }
    }

    console.log(`[更新Genre] 成功更新 ${updated} 条记录，跳过 ${skipped} 条`);
    return {
      success: true,
      message: `成功更新 ${updated} 条记录，跳过 ${skipped} 条`,
      updated,
      skipped,
      total: data.length
    };

  } catch (err) {
    console.error('[更新Genre] 失败:', err);
    return { success: false, message: err.message };
  }
};
