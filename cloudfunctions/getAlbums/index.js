const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();

exports.main = async (event, context) => {
  try {
    // 只返回首页需要的字段，减少数据传输
    const { data } = await db.collection('albums')
      .limit(100)
      .field({
        _id: true,
        title: true,
        artist: true,
        coverUrl: true,
        rating: true,
        genre: true
      })
      .get();
    
    console.log('查询到专辑数量:', data.length);
    
    return {
      success: true,
      count: data.length,
      albums: data
    };
  } catch (err) {
    console.error('错误:', err);
    return {
      success: false,
      message: err.message
    };
  }
};
