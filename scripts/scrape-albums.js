/**
 * 爬虫脚本：爬取 RYM + Pitchfork/Metacritic 专辑数据
 * 输出：raw-albums.json
 * 注意：请遵守网站的 robots.txt 和爬虫政策，控制请求频率
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// 延迟函数，控制请求频率
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 简单的 HTTP GET 请求
function httpGet(url, headers = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.0',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        ...headers
      }
    };

    https.get(url, options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve({ status: res.statusCode, data }));
    }).on('error', reject);
  });
}

// 从 RYM 爬取专辑数据（示例：爬取高分专辑页面）
async function scrapeRYM() {
  const albums = [];
  console.log('[RYM] 开始爬取...');

  try {
    // RYM 高分专辑页面（示例 URL，请根据实际页面调整）
    const pages = [1, 2, 3]; // 爬取前3页

    for (const page of pages) {
      const url = `https://rateyourmusic.com/charts/top/album/all-time/${page}/`;
      console.log(`[RYM] 正在爬取第 ${page} 页...`);

      try {
        const response = await httpGet(url);

        if (response.status === 200) {
          // 简单的正则匹配提取专辑信息（实际可能需要更复杂的解析）
          const albumMatches = response.data.match(/<a href="\/release\/[^"]+"[^>]*>([^<]+)<\/a>/g);
          const artistMatches = response.data.match(/<a href="\/artist\/[^"]+"[^>]*>([^<]+)<\/a>/g);

          if (albumMatches && artistMatches) {
            for (let i = 0; i < Math.min(albumMatches.length, artistMatches.length, 10); i++) {
              const albumName = albumMatches[i].replace(/<[^>]+>/g, '').trim();
              const artistName = artistMatches[i].replace(/<[^>]+>/g, '').trim();

              if (albumName && artistName) {
                albums.push({
                  title: albumName,
                  artist: artistName,
                  source: 'RYM',
                  page: page,
                  crawledAt: new Date().toISOString()
                });
              }
            }
          }
        }
      } catch (err) {
        console.error(`[RYM] 第 ${page} 页爬取失败:`, err.message);
      }

      // 延迟 3 秒，避免请求过快
      await delay(3000);
    }
  } catch (err) {
    console.error('[RYM] 爬取过程出错:', err.message);
  }

  console.log(`[RYM] 爬取完成，共 ${albums.length} 条数据`);
  return albums;
}

// 从 Pitchfork 爬取专辑数据
async function scrapePitchfork() {
  const albums = [];
  console.log('[Pitchfork] 开始爬取...');

  try {
    // Pitchfork 最佳新专辑页面
    const url = 'https://pitchfork.com/reviews/best/albums/';
    console.log('[Pitchfork] 正在爬取最佳专辑...');

    const response = await httpGet(url);

    if (response.status === 200) {
      // 提取专辑和艺术家信息
      const titleMatches = response.data.match(/<h2[^>]*class="[^"]*title[^"]*"[^>]*>([^<]+)<\/h2>/g);
      const artistMatches = response.data.match(/<ul[^>]*class="[^"]*artist-list[^"]*"[^>]*>([^<]+)<\/ul>/g);

      if (titleMatches) {
        for (let i = 0; i < Math.min(titleMatches.length, 20); i++) {
          const title = titleMatches[i].replace(/<[^>]+>/g, '').trim();
          const artist = artistMatches && artistMatches[i]
            ? artistMatches[i].replace(/<[^>]+>/g, '').trim()
            : 'Unknown Artist';

          if (title) {
            albums.push({
              title: title,
              artist: artist,
              source: 'Pitchfork',
              crawledAt: new Date().toISOString()
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('[Pitchfork] 爬取失败:', err.message);
  }

  console.log(`[Pitchfork] 爬取完成，共 ${albums.length} 条数据`);
  return albums;
}

// 从 Metacritic 爬取专辑数据
async function scrapeMetacritic() {
  const albums = [];
  console.log('[Metacritic] 开始爬取...');

  try {
    // Metacritic 高分专辑页面
    const url = 'https://www.metacritic.com/browse/albums/score/metascore/all/filtered';
    console.log('[Metacritic] 正在爬取高分专辑...');

    const response = await httpGet(url);

    if (response.status === 200) {
      // 提取专辑信息
      const albumMatches = response.data.match(/<a href="\/album\/[^"]+"[^>]*>([^<]+)<\/a>/gi);

      if (albumMatches) {
        for (let i = 0; i < Math.min(albumMatches.length, 25); i++) {
          const text = albumMatches[i].replace(/<[^>]+>/g, '').trim();

          // 尝试分离艺术家和专辑名
          const parts = text.split('-');
          const artist = parts[0] ? parts[0].trim() : 'Unknown Artist';
          const title = parts[1] ? parts[1].trim() : text;

          if (title) {
            albums.push({
              title: title,
              artist: artist,
              source: 'Metacritic',
              crawledAt: new Date().toISOString()
            });
          }
        }
      }
    }
  } catch (err) {
    console.error('[Metacritic] 爬取失败:', err.message);
  }

  console.log(`[Metacritic] 爬取完成，共 ${albums.length} 条数据`);
  return albums;
}

// 主函数
async function main() {
  console.log('=== 开始爬取专辑数据 ===\n');

  // 创建输出目录
  const outputDir = path.join(__dirname, '..', 'data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 爬取所有数据源
  const rymAlbums = await scrapeRYM();
  await delay(5000); // 延迟 5 秒再爬下一个源

  const pitchforkAlbums = await scrapePitchfork();
  await delay(5000);

  const metacriticAlbums = await scrapeMetacritic();

  // 合并所有数据
  const allAlbums = [...rymAlbums, ...pitchforkAlbums, ...metacriticAlbums];

  // 保存原始数据
  const outputPath = path.join(outputDir, 'raw-albums.json');
  fs.writeFileSync(outputPath, JSON.stringify(allAlbums, null, 2), 'utf8');

  console.log(`\n=== 爬取完成 ===`);
  console.log(`- RYM: ${rymAlbums.length} 条`);
  console.log(`- Pitchfork: ${pitchforkAlbums.length} 条`);
  console.log(`- Metacritic: ${metacriticAlbums.length} 条`);
  console.log(`- 总计: ${allAlbums.length} 条`);
  console.log(`- 输出文件: ${outputPath}`);
}

// 运行
main().catch(err => {
  console.error('脚本运行失败:', err);
  process.exit(1);
});
