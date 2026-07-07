App({
  onLaunch() {
    // 初始化云开发
    if (!wx.cloud) {
      console.error('[App] 请使用 2.2.3 或以上的基础库以使用云能力');
    } else {
      wx.cloud.init({
        env: 'YOUR_CLOUD_ENV_ID',
        traceUser: true
      });
    }
  }
});
