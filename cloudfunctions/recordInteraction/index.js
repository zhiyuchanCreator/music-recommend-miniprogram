/**
 * recordInteraction：记录用户行为事件（用户 Memory 数据层）
 *
 * 入参：
 *   albumId {string} 专辑 _id（必填）
 *   action  {string} view | favorite | unfavorite | skip
 *   context {object} 可选上下文，如 { from: 'detail' | 'home' | 'similar' }
 *
 * 出参：
 *   { success, logged }
 *
 * 说明：
 * - openid 由云函数从调用上下文获取，前端不可伪造
 * - 每次浏览去重：同一专辑的 view 记录，10 分钟内不重复写入
 */
const cloud = require('wx-server-sdk');
cloud.init({ env: cloud.DYNAMIC_CURRENT_ENV });
const db = cloud.database();
const _ = db.command;

const VALID_ACTIONS = ['view', 'favorite', 'unfavorite', 'skip'];
const VIEW_DEDUPE_WINDOW_MS = 10 * 60 * 1000;

exports.main = async (event) => {
  const { OPENID } = cloud.getWXContext();
  const { albumId, action, context } = event || {};

  if (!OPENID) {
    return { success: false, errMsg: '无法获取用户身份' };
  }
  if (!albumId || !VALID_ACTIONS.includes(action)) {
    return { success: false, errMsg: `参数错误：albumId 必填，action 须为 ${VALID_ACTIONS.join('/')}` };
  }

  try {
    // view 去重：短时间内反复进入同一详情页不重复记录
    if (action === 'view') {
      const recent = await db.collection('interactions')
        .where({
          openid: OPENID,
          albumId,
          action: 'view',
          createdAt: _.gt(new Date(Date.now() - VIEW_DEDUPE_WINDOW_MS))
        })
        .count();
      if (recent.total > 0) {
        return { success: true, logged: false, reason: 'duplicate' };
      }
    }

    await db.collection('interactions').add({
      data: {
        openid: OPENID,
        albumId,
        action,
        context: context || {},
        createdAt: new Date()
      }
    });

    return { success: true, logged: true };
  } catch (err) {
    console.error('[recordInteraction] failed:', err);
    return { success: false, errMsg: err.message || String(err) };
  }
};
