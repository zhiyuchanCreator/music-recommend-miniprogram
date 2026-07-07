const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

exports.main = async (event, context) => {
  console.log('[清空] 开始清空 albums 集合...');
  
  try {
    // 获取所有记录
    const { data } = await db.collection('albums').get();
    
    if (data.length === 0) {
      return { success: true, message: '集合已经是空的', deleted: 0 };
    }
    
    // 批量删除
    const batch = data.map(item => ({
      method: 'delete',
      data: { _id: item._id }
    }));
    
    // 每次最多删除 100 条
    const batchSize = 100;
    let deleted = 0;
    
    for (let i = 0; i < batch.length; i += batchSize) {
      const chunk = batch.slice(i, i + batchSize);
      const tasks = chunk.map(item => 
        db.collection('albums').doc(item.data._id).remove()
      );
      await Promise.all(tasks);
      deleted += chunk.length;
    }
    
    console.log(`[清空] 成功删除 ${deleted} 条记录`);
    return { success: true, message: `成功删除 ${deleted} 条记录`, deleted };
    
  } catch (err) {
    console.error('[清空] 失败:', err);
    return { success: false, message: err.message };
  }
};
