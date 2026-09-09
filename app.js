App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('[App] 请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      // 云环境 ID：复制 env.example.js 为 env.config.js 并填入自己的环境 ID；
      // 未创建 env.config.js 时使用帐号默认环境
      let CLOUD_ENV_ID;
      try {
        CLOUD_ENV_ID = require('./env.config.js').env;
      } catch (e) {
        CLOUD_ENV_ID = undefined;
      }
      wx.cloud.init({
        env: CLOUD_ENV_ID,
        traceUser: true
      });
    }
  },

  // 全局未捕获错误兜底
  onError(err) {
    console.error('[App] Global error:', err);
    this.redirectToErrorPage();
  },

  // 全局未处理 Promise 拒绝兜底
  onUnhandledRejection(res) {
    console.error('[App] Unhandled rejection:', res);
    this.redirectToErrorPage();
  },

  redirectToErrorPage() {
    // 避免在错误页本身反复跳转
    const pages = getCurrentPages();
    const currentRoute = pages.length > 0 ? pages[pages.length - 1].route : '';
    if (currentRoute && currentRoute.indexOf('pages/error/index') !== -1) {
      return;
    }

    wx.navigateTo({
      url: '/pages/error/index'
    });
  }
});
