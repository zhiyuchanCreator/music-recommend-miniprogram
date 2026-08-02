Page({
  data: {
    favorites: [],
    history: [],
    activeTab: 'favorites',
    favoriteAlbums: [],
    historyAlbums: [],
    wallAlbums: [],
    pinnedAlbums: [],
    wallMode: 'auto',       // 'auto' | 'favorites' | 'history'
    isWallExpanded: false,  // 是否展开为网格
    wallTrackDuration: 0,   // 专辑墙循环滚动动画时长（秒）
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
  async loadData() {
    this.setData({ loading: true });

    await new Promise(resolve => setTimeout(resolve, 300));
    this.loadFavorites();
    await this.loadHistory();
    this.loadWallAlbums();
    this.setData({ loading: false });
  },

  // 获取当前展示源：收藏或历史
  getWallSourceAlbums() {
    const { wallMode, favorites, historyAlbums } = this.data;

    if (wallMode === 'favorites') {
      return { source: favorites, type: 'favorites' };
    }
    if (wallMode === 'history') {
      return { source: historyAlbums, type: 'history' };
    }

    // auto 模式：收藏 >= 3 用收藏，否则用历史
    if (favorites.length >= 3) {
      return { source: favorites, type: 'favorites' };
    }
    return { source: historyAlbums, type: 'history' };
  },

  // 加载专辑墙数据
  loadWallAlbums() {
    const pinned = wx.getStorageSync('pinnedAlbums') || [];
    const { source, type } = this.getWallSourceAlbums();
    const pinnedIds = new Set(pinned.map(p => p.id || p._id));

    // 去重并按是否置顶排序（置顶在前）
    const seen = new Set();
    const candidates = [];

    [...pinned, ...source].forEach(item => {
      const id = item.id || item._id;
      if (!id || seen.has(id)) return;
      seen.add(id);
      candidates.push({
        id,
        coverUrl: item.coverUrl,
        title: item.title,
        artist: item.artist,
        isPinned: pinnedIds.has(id)
      });
    });

    const wallAlbums = candidates.slice(0, 9);
    // 滚动速度：约 60rpx/秒
    const SCROLL_SPEED = 60;
    const itemSpacing = 176; // 160rpx 封面 + 16rpx 间距
    const wallTrackDuration = wallAlbums.length > 1
      ? (wallAlbums.length * itemSpacing) / SCROLL_SPEED
      : 0;

    this.setData({
      pinnedAlbums: pinned,
      wallAlbums,
      wallAlbumsLoop: wallAlbums.length > 1 ? wallAlbums.concat(wallAlbums) : wallAlbums,
      wallTrackDuration
    });
  },

  // 专辑墙项点击：跳转到详情
  onWallItemTap(e) {
    const { id } = e.currentTarget.dataset;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  },

  // 专辑墙长按：弹出置顶/取消置顶菜单
  onWallItemLongPress(e) {
    const { id } = e.currentTarget.dataset;
    const pinned = this.data.pinnedAlbums;
    const isPinned = pinned.some(p => p.id === id);

    const itemList = isPinned
      ? ['取消置顶', '查看专辑']
      : ['置顶', '查看专辑'];

    wx.showActionSheet({
      itemList,
      success: (res) => {
        if (res.tapIndex === 0) {
          if (isPinned) {
            this.unpinAlbum(id);
          } else {
            this.pinAlbum(id);
          }
        } else if (res.tapIndex === 1) {
          this.onWallItemTap({ currentTarget: { dataset: { id } } });
        }
      }
    });
  },

  // 置顶专辑
  pinAlbum(id) {
    const album = this.data.wallAlbums.find(item => item.id === id);
    if (!album) return;

    let pinned = wx.getStorageSync('pinnedAlbums') || [];
    pinned = pinned.filter(p => p.id !== id);
    pinned.unshift(album);

    wx.setStorageSync('pinnedAlbums', pinned);
    this.loadWallAlbums();

    wx.showToast({ title: '已置顶', icon: 'success' });
  },

  // 取消置顶
  unpinAlbum(id) {
    let pinned = wx.getStorageSync('pinnedAlbums') || [];
    pinned = pinned.filter(p => p.id !== id);

    wx.setStorageSync('pinnedAlbums', pinned);
    this.loadWallAlbums();

    wx.showToast({ title: '已取消置顶', icon: 'success' });
  },

  // 切换专辑墙展示来源
  onChangeWallMode() {
    const { wallMode } = this.data;
    let nextMode = 'history';

    if (wallMode === 'auto') {
      // auto 时根据当前实际展示来源切换
      nextMode = this.data.favorites.length >= 3 ? 'history' : 'favorites';
    } else if (wallMode === 'favorites') {
      nextMode = 'history';
    } else if (wallMode === 'history') {
      nextMode = 'favorites';
    }

    this.setData({ wallMode: nextMode }, () => {
      this.loadWallAlbums();
    });
  },

  // 切换专辑墙展开/收起
  onToggleWallExpand() {
    this.setData({ isWallExpanded: !this.data.isWallExpanded });
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
      return this.fetchHistoryAlbums(history);
    } else {
      this.setData({
        history,
        historyAlbums: []
      });
      return Promise.resolve();
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

    return Promise.all(promises).then(results => {
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
          this.loadWallAlbums();

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
          this.loadWallAlbums();

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
          this.loadWallAlbums();

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
