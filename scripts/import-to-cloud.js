/**
 * 导入脚本：批量导入微信云开发 albums 集合
 * 功能：自动分批500条，带日志
 */

const fs = require('fs');
const path = require('path');

// 微信云开发 SDK
const cloud = require('wx-server-sdk');

// 配置
const CONFIG = {
  // 云开发环境ID（请替换为你的环境ID）
  env: '<YOUR_ENV_ID>',
  // 集合名称
  collection: 'albums',
  // 每批导入数量
  batchSize: 500,
  // 重试次数
  maxRetries: 3,
  // 重试延迟（毫秒）
  retryDelay: 1000
};

// 延迟函数
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 初始化云开发
function initCloud() {
  console.log('[初始化] 正在连接微信云开发...');

  try {
    cloud.init({
      env: CONFIG.env,
      traceUser: true
    });
    console.log('[初始化] 连接成功');
  } catch (err) {
    console.error('[初始化] 连接失败:', err.message);
    console.log('[提示] 请确保:');
    console.log('  1. 已安装 wx-server-sdk: npm install wx-server-sdk');
    console.log('  2. 已配置正确的 env 环境ID');
    console.log('  3. 已登录微信开发者工具或配置好云开发密钥');
    throw err;
  }
}

// 读取清洗后的数据
function readCleanData() {
  const inputPath = path.join(__dirname, '..', 'data', 'albums.json');

  if (!fs.existsSync(inputPath)) {
    throw new Error(`找不到数据文件: ${inputPath}，请先运行 clean-data.js`);
  }

  const data = fs.readFileSync(inputPath, 'utf8');
  const albums = JSON.parse(data);

  console.log(`[读取] 共 ${albums.length} 条数据待导入`);
  return albums;
}

// 分批处理数组
function chunkArray(array, size) {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

// 检查集合是否存在，不存在则创建
async function ensureCollection(db) {
  try {
    // 尝试获取集合信息
    await db.collection(CONFIG.collection).limit(1).get();
    console.log(`[集合] '${CONFIG.collection}' 已存在`);
  } catch (err) {
    // 集合不存在，尝试创建
    console.log(`[集合] '${CONFIG.collection}' 不存在，尝试创建...`);
    try {
      await db.createCollection(CONFIG.collection);
      console.log(`[集合] 创建成功`);
    } catch (createErr) {
      console.error(`[集合] 创建失败:`, createErr.message);
      throw createErr;
    }
  }
}

// 清空集合（可选）
async function clearCollection(db) {
  console.log(`[清空] 正在清空集合 '${CONFIG.collection}'...`);

  try {
    // 获取所有文档ID
    const { data } = await db.collection(CONFIG.collection).limit(1000).get();

    if (data.length === 0) {
      console.log('[清空] 集合为空，无需清空');
      return;
    }

    // 批量删除
    const ids = data.map(doc => doc._id);
    const deletePromises = ids.map(id =>
      db.collection(CONFIG.collection).doc(id).remove()
    );

    await Promise.all(deletePromises);
    console.log(`[清空] 已删除 ${ids.length} 条数据`);

    // 如果还有更多数据，递归清空
    if (data.length === 1000) {
      await clearCollection(db);
    }

  } catch (err) {
    console.error('[清空] 失败:', err.message);
    // 不清空也可以继续，所以不抛出错误
  }
}

// 批量添加文档（带重试）
async function batchAdd(db, batch, batchIndex, totalBatches) {
  const collection = db.collection(CONFIG.collection);

  for (let attempt = 1; attempt <= CONFIG.maxRetries; attempt++) {
    try {
      console.log(`[导入] 批次 ${batchIndex}/${totalBatches} (第${attempt}次尝试)...`);

      // 使用 add 批量添加
      const addPromises = batch.map(album =>
        collection.add({ data: album })
      );

      const results = await Promise.all(addPromises);

      // 检查是否有失败的
      const failed = results.filter(r => !r._id);
      if (failed.length > 0) {
        throw new Error(`${failed.length} 条数据添加失败`);
      }

      console.log(`[导入] 批次 ${batchIndex} 成功，导入 ${batch.length} 条数据`);
      return { success: true, count: batch.length };

    } catch (err) {
      console.error(`[导入] 批次 ${batchIndex} 第${attempt}次尝试失败:`, err.message);

      if (attempt < CONFIG.maxRetries) {
        console.log(`[导入] ${CONFIG.retryDelay}ms 后重试...`);
        await delay(CONFIG.retryDelay);
      } else {
        console.error(`[导入] 批次 ${batchIndex} 最终失败`);
        return { success: false, count: 0, error: err.message };
      }
    }
  }
}

// 主函数
async function main() {
  console.log('=== 开始导入微信云开发 ===\n');

  // 记录开始时间
  const startTime = Date.now();

  try {
    // 1. 初始化云开发
    initCloud();
    const db = cloud.database();

    // 2. 确保集合存在
    await ensureCollection(db);

    // 3. 读取数据
    const albums = readCleanData();

    if (albums.length === 0) {
      console.log('[提示] 没有数据需要导入');
      return;
    }

    // 4. 询问是否清空（这里默认不清空，可以手动修改代码）
    // await clearCollection(db);

    // 5. 分批处理
    const batches = chunkArray(albums, CONFIG.batchSize);
    console.log(`\n[分批] 共 ${batches.length} 批次，每批最多 ${CONFIG.batchSize} 条\n`);

    // 6. 导入数据
    let successCount = 0;
    let failCount = 0;
    const failedBatches = [];

    for (let i = 0; i < batches.length; i++) {
      const result = await batchAdd(db, batches[i], i + 1, batches.length);

      if (result.success) {
        successCount += result.count;
      } else {
        failCount += batches[i].length;
        failedBatches.push({ batch: i + 1, error: result.error });
      }

      // 批次间延迟，避免请求过快
      if (i < batches.length - 1) {
        await delay(500);
      }
    }

    // 7. 保存导入日志
    const log = {
      timestamp: new Date().toISOString(),
      total: albums.length,
      success: successCount,
      failed: failCount,
      batches: batches.length,
      duration: Date.now() - startTime,
      failedBatches: failedBatches
    };

    const logPath = path.join(__dirname, '..', 'data', 'import-log.json');
    fs.writeFileSync(logPath, JSON.stringify(log, null, 2), 'utf8');

    // 8. 输出结果
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);

    console.log(`\n=== 导入完成 ===`);
    console.log(`- 总计: ${albums.length} 条`);
    console.log(`- 成功: ${successCount} 条`);
    console.log(`- 失败: ${failCount} 条`);
    console.log(`- 批次: ${batches.length} 批`);
    console.log(`- 耗时: ${duration} 秒`);

    if (failedBatches.length > 0) {
      console.log(`\n失败的批次:`);
      failedBatches.forEach(f => console.log(`  - 批次 ${f.batch}: ${f.error}`));
    }

    console.log(`\n日志文件: ${logPath}`);

  } catch (err) {
    console.error('\n导入过程出错:', err.message);
    process.exit(1);
  }
}

// 运行
main();
