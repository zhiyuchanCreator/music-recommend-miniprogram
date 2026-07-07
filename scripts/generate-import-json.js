/**
 * 生成可直接导入微信云开发的 JSON 文件
 * 输出：cloud-import.json（可直接在云开发控制台导入）
 */

const fs = require('fs');
const path = require('path');

// 主函数
function main() {
  console.log('=== 生成云开发导入文件 ===\n');

  try {
    // 1. 读取清洗后的数据
    const inputPath = path.join(__dirname, '..', 'data', 'albums.json');

    if (!fs.existsSync(inputPath)) {
      console.error('错误：找不到 albums.json 文件');
      console.log('请先运行：node scripts/clean-data.js');
      return;
    }

    const data = fs.readFileSync(inputPath, 'utf8');
    const albums = JSON.parse(data);

    console.log(`[读取] 共 ${albums.length} 条数据`);

    // 2. 转换为云开发格式（添加 _openid 字段）
    const cloudData = albums.map(album => ({
      ...album,
      // 云开发需要的字段
      _openid: '{openid}', // 导入时会自动替换
    }));

    // 3. 保存为导入文件
    const outputDir = path.join(__dirname, '..', 'data');
    const outputPath = path.join(outputDir, 'cloud-import.json');

    fs.writeFileSync(outputPath, JSON.stringify(cloudData, null, 2), 'utf8');

    console.log(`\n[成功] 已生成导入文件: ${outputPath}`);
    console.log(`\n=== 下一步操作 ===`);
    console.log('方法1：使用微信开发者工具导入');
    console.log('  1. 打开微信开发者工具');
    console.log('  2. 点击 "云开发" 按钮');
    console.log('  3. 进入 "数据库"');
    console.log('  4. 创建集合：albums');
    console.log('  5. 点击 "导入" 按钮');
    console.log(`  6. 选择文件：${outputPath}`);
    console.log('');
    console.log('方法2：使用云函数导入');
    console.log('  查看 scripts/cloud-setup-guide.md 获取详细步骤');

    // 4. 同时生成 CSV 格式（方便Excel查看）
    const csvPath = path.join(outputDir, 'albums.csv');
    const csvHeader = 'ID,Title,Artist,Year,Genre,Rating,Source\n';
    const csvRows = albums.map(a =>
      `"${a._id}","${a.title}","${a.artist}","${a.year || ''}","${(a.genre || []).join('/')}","${a.rating || ''}","${a.source}"`
    ).join('\n');

    fs.writeFileSync(csvPath, csvHeader + csvRows, 'utf8');
    console.log(`\n[额外] 已生成 CSV 文件: ${csvPath}`);

  } catch (err) {
    console.error('生成失败:', err.message);
  }
}

// 运行
main();
