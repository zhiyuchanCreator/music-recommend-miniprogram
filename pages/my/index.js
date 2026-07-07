Page({
  data: {
    favorites: [],
    history: [],
    activeTab: 'favorites',
    favoriteAlbums: [],
    historyAlbums: [],
    loading: true
  },

  onLoad() {
    this.loadData();
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 1 });
    }
    this.loadData();
  },

  // 加载数据
  loadData() {
    this.setData({ loading: true });
    
    setTimeout(() => {
      this.loadFavorites();
      this.loadHistory();
      this.setData({ loading: false });
    }, 300);
  },

  // 加载收藏列表
  loadFavorites() {
    const favorites = wx.getStorageSync('favorites') || [];
    this.setData({ 
      favorites,
      favoriteAlbums: favorites
    });
  },

  // 加载历史记录
  loadHistory() {
    const history = wx.getStorageSync('history') || [];
    
    if (history.length > 0) {
      this.fetchHistoryAlbums(history);
    } else {
      this.setData({ 
        history,
        historyAlbums: []
      });
    }
  },

  // 获取历史记录的专辑详情
  fetchHistoryAlbums(history) {
    const db = wx.cloud.database();
    
    const promises = history.map(item => {
      return db.collection('albums').doc(item.id).get()
        .then(res => ({
          ...res.data,
          _id: item.id,
          viewTime: item.timestamp,
          viewTimeStr: this.formatTime(item.timestamp)
        }))
        .catch(() => null);
    });
    
    Promise.all(promises).then(results => {
      const validAlbums = results.filter(item => item !== null);
      this.setData({ 
        history,
        historyAlbums: validAlbums
      });
    });
  },

  // 格式化时间
  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // 小于1小时
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? '刚刚' : `${minutes}分钟前`;
    }
    // 小于24小时
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}小时前`;
    }
    // 小于7天
    if (diff < 604800000) {
      const days = Math.floor(diff / 86400000);
      return `${days}天前`;
    }
    
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}-${day}`;
  },

  // 切换标签
  onTabChange(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 点击统计卡片切换标签
  switchToTab(e) {
    const tab = e.currentTarget.dataset.tab;
    this.setData({ activeTab: tab });
  },

  // 跳转到首页
  goToHome() {
    wx.switchTab({
      url: '/pages/home/index'
    });
  },

  // 跳转到专辑详情
  onAlbumTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  },

  // 取消收藏
  onRemoveFavorite(e) {
    const { id } = e.currentTarget.dataset;
    
    wx.showModal({
      title: '取消收藏',
      content: '确定要取消收藏这张专辑吗？',
      confirmColor: '#8B5CF6',
      success: (res) => {
        if (res.confirm) {
          let favorites = wx.getStorageSync('favorites') || [];
          favorites = favorites.filter(item => item.id !== id);
          wx.setStorageSync('favorites', favorites);
          
          this.setData({ 
            favorites,
            favoriteAlbums: favorites
          });
          
          wx.showToast({ 
            title: '已取消收藏', 
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 清空历史记录
  onClearHistory() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有浏览历史吗？',
      confirmColor: '#8B5CF6',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('history');
          this.setData({ 
            history: [],
            historyAlbums: []
          });
          wx.showToast({ 
            title: '已清空', 
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  },

  // 清空所有收藏
  onClearFavorites() {
    wx.showModal({
      title: '确认清空',
      content: '确定要清空所有收藏吗？',
      confirmColor: '#8B5CF6',
      success: (res) => {
        if (res.confirm) {
          wx.removeStorageSync('favorites');
          this.setData({ 
            favorites: [],
            favoriteAlbums: []
          });
          wx.showToast({ 
            title: '已清空', 
            icon: 'success',
            duration: 1500
          });
        }
      }
    });
  }
});
