Page({
  data: {
    redirectUrl: ''
  },

  onLoad(options) {
    // 可选：记录失败前想去的页面，刷新成功后尝试跳转回去
    this.setData({
      redirectUrl: options.redirect || ''
    });
  },

  onRefresh() {
    const { redirectUrl } = this.data;
    if (redirectUrl) {
      wx.reLaunch({ url: redirectUrl });
    } else {
      wx.reLaunch({ url: '/pages/home/index' });
    }
  },

  onGoHome() {
    wx.switchTab({ url: '/pages/home/index' });
  }
});
