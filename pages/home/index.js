const SEARCH_HISTORY_KEY = 'search_history';

Page({
  data: {
    showSidebar: false,
    selectedCategory: '',
    searchKeyword: '',
    isSearching: false,
    searchHistory: [],
    showHeader: true, // 控制金刚区显示/隐藏
    isLoading: true, // 骨架屏加载状态
    categories: [
      'rock', 'jazz', 'pop', 'electronic', 'hip hop',
      'classical', 'metal', 'r&b', 'soul', 'reggae & dub',
      'international', 'african', 'latin', 'folk',
      'country', 'blues', 'avant-garde'
    ],
    recentGuides: []
  },

  onLoad() {
    this.setData({ isLoading: true });
    this.loadAlbums();
    this.loadSearchHistory();
    this.lastScrollTop = 0; // 记录上次滚动位置
  },

  // 下拉刷新
  onPullDownRefresh() {
    this.onRefresh();
  },

  // 刷新数据
  onRefresh() {
    this.setData({ isLoading: true });
    this.loadAlbums(() => {
      wx.stopPullDownRefresh();
    });
  },

  // 页面滚动监听
  onPageScroll(e) {
    const scrollTop = e.scrollTop;
    const threshold = 100; // 滚动超过100px时隐藏金刚区
    
    // 向下滚动超过阈值，隐藏金刚区
    if (scrollTop > threshold && this.data.showHeader) {
      this.setData({ showHeader: false });
    }
    // 向上滚动回顶部，显示金刚区
    else if (scrollTop <= threshold && !this.data.showHeader) {
      this.setData({ showHeader: true });
    }
    
    // 控制Tab栏显示/隐藏
    this.handleTabBar(scrollTop);
    
    this.lastScrollTop = scrollTop;
  },

  // 控制Tab栏显示/隐藏
  handleTabBar(scrollTop) {
    const scrollDiff = scrollTop - this.lastScrollTop;
    
    // 向下滚动超过50px，隐藏Tab栏
    if (scrollDiff > 50 && scrollTop > 200) {
      this.hideTabBar();
    }
    // 向上滚动超过50px，显示Tab栏
    else if (scrollDiff < -50) {
      this.showTabBar();
    }
  },

  // 显示Tab栏
  showTabBar() {
    const tabBar = this.getTabBar();
    if (tabBar) {
      tabBar.show();
    }
  },

  // 隐藏Tab栏
  hideTabBar() {
    const tabBar = this.getTabBar();
    if (tabBar) {
      tabBar.hide();
    }
  },

  // 加载搜索历史
  loadSearchHistory() {
    try {
      const history = wx.getStorageSync(SEARCH_HISTORY_KEY) || [];
      this.setData({ searchHistory: history });
    } catch (err) {
      console.error('[Home] Failed to load search history:', err);
    }
  },

  // 保存搜索历史（去重 + 置顶）
  saveSearchHistory(keyword) {
    if (!keyword.trim()) return;
    
    let history = this.data.searchHistory || [];
    const trimmedKeyword = keyword.trim();
    
    // 1. 删除已存在的相同关键词
    history = history.filter(item => item !== trimmedKeyword);
    
    // 2. 将新关键词添加到最前面
    history.unshift(trimmedKeyword);
    
    // 3. 最多保留 10 条历史记录
    if (history.length > 10) {
      history = history.slice(0, 10);
    }
    
    // 4. 保存到本地存储
    try {
      wx.setStorageSync(SEARCH_HISTORY_KEY, history);
      this.setData({ searchHistory: history });
    } catch (err) {
      console.error('[Home] Failed to save search history:', err);
    }
  },

  // 删除单条搜索历史
  deleteHistoryItem(e) {
    const keyword = e.currentTarget.dataset.keyword;
    let history = this.data.searchHistory.filter(item => item !== keyword);
    
    try {
      wx.setStorageSync(SEARCH_HISTORY_KEY, history);
      this.setData({ searchHistory: history });
    } catch (err) {
      console.error('[Home] Failed to delete history item:', err);
    }
  },

  // 清空搜索历史
  clearSearchHistory() {
    try {
      wx.removeStorageSync(SEARCH_HISTORY_KEY);
      this.setData({ searchHistory: [] });
    } catch (err) {
      console.error('[Home] Failed to clear search history:', err);
    }
  },

  // 点击历史记录搜索
  onHistoryItemTap(e) {
    // 防止重复点击
    if (this.isSearching) return;
    this.isSearching = true;
    
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    this.onSearch();
    
    // 300ms后重置标志
    setTimeout(() => {
      this.isSearching = false;
    }, 300);
  },

  // 跳转到搜索页面
  goToSearchPage() {
    wx.navigateTo({
      url: '/pages/search/index'
    });
  },

  // 加载专辑数据（从云数据库读取）
  loadAlbums(callback) {
    this.loadFromCloud(callback);
  },

  // 从云开发加载数据
  loadFromCloud(callback) {
    // 使用云函数获取数据
    wx.cloud.callFunction({
      name: 'getAlbums'
    })
      .then(res => {
        const result = res.result;

        if (result.success && result.albums && result.albums.length > 0) {
          const recentGuides = result.albums.map(album => ({
            id: album._id,
            title: album.title,
            artist: album.artist,
            image: album.coverUrl
          }));
          this.setData({
            recentGuides,
            isLoading: false
          });
        } else {
          // 云数据库为空，使用本地数据
          this.loadFromLocal(callback);
          return;
        }
        if (callback) callback();
      })
      .catch(err => {
        console.error('[Home] Failed to load from cloud:', err);
        // 云开发失败，使用本地数据
        this.loadFromLocal(callback);
      });
  },

  // 从本地加载数据（备用）
  loadFromLocal(callback) {
    try {
      const localData = require('../../data/albums.js');
      const albums = localData.albums || [];

      const recentGuides = albums.slice(0, 5).map(album => ({
        id: album._id,
        title: album.title,
        artist: album.artist,
        image: album.coverUrl
      }));

      this.setData({
        recentGuides,
        isLoading: false
      });
      if (callback) callback();
    } catch (err) {
      console.error('[Home] Failed to load albums:', err);
      this.setData({ isLoading: false });
      if (callback) callback();
    }
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setData({ selected: 0 });
    }
  },

  onMenuTap() {
    this.setData({ showSidebar: true });
  },

  onSidebarClose() {
    this.setData({ showSidebar: false });
  },

  onCategoryTap(e) {
    const category = e.currentTarget.dataset.category;
    const isSameCategory = this.data.selectedCategory === category;
    
    // 如果点击的是已选中的分类，则取消筛选
    if (isSameCategory) {
      this.setData({ selectedCategory: '' });
      this.loadAlbums(); // 重新加载全部
    } else {
      this.setData({ selectedCategory: category });
      this.filterByCategory(category); // 按分类筛选
    }
  },

  // 按分类筛选专辑
  filterByCategory(category) {
    const db = wx.cloud.database();
    
    wx.showLoading({ title: '筛选中...' });
    
    db.collection('albums')
      .where({
        genre: db.RegExp({
          regexp: category,
          options: 'i'
        })
      })
      .get()
      .then(res => {
        wx.hideLoading();
        
        const filtered = res.data.map(album => ({
          id: album._id,
          title: album.title,
          artist: album.artist,
          image: album.coverUrl
        }));
        
        this.setData({ recentGuides: filtered });
      })
      .catch(err => {
        wx.hideLoading();
        console.error('[Home] Filter failed:', err);
        wx.showToast({ title: '筛选失败', icon: 'error' });
      });
  },

  onShuffleTap() {
    // 按钮动画效果
    this.setData({ isShuffling: true });

    // 使用更优雅的加载提示
    wx.showLoading({
      title: '正在寻找好音乐...',
      mask: true
    });

    // 从云数据库随机获取一张专辑
    const db = wx.cloud.database();
    db.collection('albums')
      .get()
      .then(res => {
        wx.hideLoading();
        this.setData({ isShuffling: false });

        if (res.data && res.data.length > 0) {
          // 随机选择一张专辑
          const randomIndex = Math.floor(Math.random() * res.data.length);
          const randomAlbum = res.data[randomIndex];

          // 添加延迟让过渡更自然
          setTimeout(() => {
            wx.navigateTo({
              url: `/pages/detail/index?id=${randomAlbum._id}`
            });
          }, 800);
        } else {
          this.setData({ isShuffling: false });
          wx.showToast({
            title: '暂无推荐',
            icon: 'none'
          });
        }
      })
      .catch(err => {
        this.setData({ isShuffling: false });
        wx.hideLoading();
        console.error('[Home] Shuffle failed:', err);
        wx.showToast({
          title: '推荐失败',
          icon: 'error'
        });
      });
  },

  onAlbumTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  },

  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  onSearch() {
    const keyword = this.data.searchKeyword.trim();
    if (!keyword) {
      wx.showToast({ title: '请输入关键词', icon: 'none' });
      return;
    }

    // 保存搜索历史
    this.saveSearchHistory(keyword);
    // 跳转到搜索结果页
    wx.navigateTo({
      url: `/pages/search-result/index?keyword=${encodeURIComponent(keyword)}`
    });
  },

  // 图片加载失败处理
  onImageError(e) {
    const index = e.currentTarget.dataset.index;
    const defaultImage = 'https://picsum.photos/seed/music/300/300';

    // 更新对应索引的图片为默认图
    const recentGuides = this.data.recentGuides;
    if (recentGuides[index]) {
      recentGuides[index].image = defaultImage;
      this.setData({ recentGuides });
    }
  }
});
