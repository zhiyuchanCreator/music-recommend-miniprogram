const fs = require('fs');
const path = require('path');

// 读取 JSON 数据
const data = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'data', 'albums.json'), 'utf8'));

// CSV 表头
const headers = ['title', 'artist', 'year', 'rating', 'source', 'coverUrl', 'description'];

// 转义 CSV 字段
function escapeCsv(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  // 如果包含逗号、引号或换行，需要用引号包裹并转义内部引号
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return '"' + str.replace(/"/g, '""') + '"';
  }
  return str;
}

// 生成 CSV 行
const csvRows = data.map(item => {
  return headers.map(h => escapeCsv(item[h])).join(',');
});

// 组合 CSV 内容
const csv = [headers.join(','), ...csvRows].join('\n');

// 写入文件
const outputPath = path.join(__dirname, '..', 'data', 'albums.csv');
fs.writeFileSync(outputPath, csv, 'utf8');

console.log('创建完成: albums.csv');
console.log('共', data.length, '条记录');
