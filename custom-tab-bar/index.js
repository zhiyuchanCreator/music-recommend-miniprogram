Component({
  data: {
    selected: 0,
    showTabBar: true // 控制Tab栏显示/隐藏
  },
  
  methods: {
    switchTab(e) {
      const index = parseInt(e.currentTarget.dataset.index);
      const url = index === 0 ? '/pages/home/index' : '/pages/my/index';
      
      this.setData({ selected: index });
      
      wx.switchTab({
        url: url
      });
    },

    // 显示Tab栏
    show() {
      if (!this.data.showTabBar) {
        this.setData({ showTabBar: true });
      }
    },

    // 隐藏Tab栏
    hide() {
      if (this.data.showTabBar) {
        this.setData({ showTabBar: false });
      }
    }
  }
});
