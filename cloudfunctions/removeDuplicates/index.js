const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    console.log('[清理] 开始检测重复数据...');
    
    // 获取所有专辑
    const { data: albums } = await db.collection('albums').limit(1000).get();
    console.log(`[清理] 总共 ${albums.length} 条数据`);
    
    // 检测重复（根据 title + artist）
    const seen = new Map();
    const duplicates = [];
    
    albums.forEach(album => {
      const key = `${album.title}_${album.artist}`;
      if (seen.has(key)) {
        duplicates.push(album._id);
        console.log(`[重复] ${album.title} - ${album.artist}`);
      } else {
        seen.set(key, album._id);
      }
    });
    
    console.log(`[清理] 发现 ${duplicates.length} 条重复数据`);
    
    // 删除重复项
    let deletedCount = 0;
    for (const id of duplicates) {
      try {
        await db.collection('albums').doc(id).remove();
        deletedCount++;
        console.log(`[删除] ${id}`);
      } catch (err) {
        console.error(`[删除失败] ${id}:`, err.message);
      }
    }
    
    console.log(`[完成] 删除 ${deletedCount} 条重复数据`);
    
    return {
      success: true,
      total: albums.length,
      duplicates: duplicates.length,
      deleted: deletedCount,
      message: `清理完成，删除 ${deletedCount} 条重复数据`
    };
    
  } catch (err) {
    console.error('[错误]', err);
    return {
      success: false,
      message: err.message
    };
  }
};
