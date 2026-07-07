/**
 * 导入爬虫数据到云开发
 * 将 scraped_albums.json 导入到 albums 集合
 */

const fs = require('fs');
const path = require('path');

// 读取爬虫数据
function readScrapedData() {
  const inputPath = path.join(__dirname, '..', 'data', 'scraped_albums.json');
  
  if (!fs.existsSync(inputPath)) {
    console.error(`[错误] 找不到数据文件: ${inputPath}`);
    console.log('[提示] 请先运行爬虫: cd spider && py run_spider.py --mock');
    process.exit(1);
  }
  
  const data = fs.readFileSync(inputPath, 'utf8');
  const albums = JSON.parse(data);
  
  console.log(`[读取] 共 ${albums.length} 条专辑数据`);
  return albums;
}

// 转换为云函数导入格式
function convertForCloud(albums) {
  return albums.map((album, index) => ({
    title: album.title,
    artist: album.artist,
    year: album.year,
    genre: album.genre,
    rating: album.rating,
    coverUrl: album.coverUrl || album.cover_url,
    description: album.description || '',
    source: album.source || 'Scraped',
    // 云数据库会自动生成 _id，不需要手动指定
  }));
}

// 保存为云函数导入格式
function saveForCloudImport(albums) {
  const outputPath = path.join(__dirname, '..', 'data', 'albums_for_import.json');
  fs.writeFileSync(outputPath, JSON.stringify(albums, null, 2), 'utf8');
  console.log(`[保存] 已生成导入文件: ${outputPath}`);
  return outputPath;
}

// 主函数
async function main() {
  console.log('=== 爬虫数据导入准备 ===\n');
  
  // 1. 读取数据
  const scrapedData = readScrapedData();
  
  // 2. 转换格式
  const cloudData = convertForCloud(scrapedData);
  
  // 3. 保存导入文件
  const importFile = saveForCloudImport(cloudData);
  
  console.log('\n=== 数据准备完成 ===');
  console.log(`共 ${cloudData.length} 张专辑`);
  console.log('\n下一步:');
  console.log('1. 在微信开发者工具中，打开云开发控制台');
  console.log('2. 进入 数据库 -> albums 集合');
  console.log('3. 点击 导入，选择: data/albums_for_import.json');
  console.log('\n或使用云函数导入:');
  console.log('  1. 复制 data/albums_for_import.json 到 cloudfunctions/importData/');
  console.log('  2. 修改 cloudfunctions/importData/index.js 引用该文件');
  console.log('  3. 部署并运行云函数');
}

main().catch(console.error);
