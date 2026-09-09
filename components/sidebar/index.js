Component({
  properties: {
    show: {
      type: Boolean,
      value: false
    }
  },

  methods: {
    onMaskTap() {
      this.triggerEvent('close');
    },

    onSidebarTap(e) {
      // 阻止事件冒泡，防止点击侧边栏内部时关闭
      e.stopPropagation();
    },

    onCloseTap() {
      this.triggerEvent('close');
    },

    onNavTap(e) {
      const page = e.currentTarget.dataset.page;

      // 关闭侧边栏
      this.triggerEvent('close');

      // 跳转到已有页面
      const urlMap = {
        home: '/pages/home/index',
        collections: '/pages/my/index',
        bestof: '/pages/my/index',
        search: '/pages/search/index',
        'ai-chat': '/pages/ai-chat/index'
      };

      const url = urlMap[page];
      if (!url) return;

      if (page === 'home' || page === 'collections' || page === 'bestof') {
        wx.switchTab({ url });
      } else {
        wx.navigateTo({ url });
      }
    },

    onSocialTap(e) {
      const type = e.currentTarget.dataset.type;

      if (type === 'share') {
        wx.showShareMenu({
          withShareTicket: true,
          menus: ['shareAppMessage', 'shareTimeline']
        });
        wx.showToast({ title: '点击右上角分享', icon: 'none' });
      }
    }
  }
});
