const SEARCH_HISTORY_KEY = 'search_history';
const { create: createShflCore } = require('../../utils/shfl-core.js');

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
          this.shflCore = createShflCore().init(result.albums);
          const recentGuides = this.shflCore.getPool().map(album => ({
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
      this.shflCore = createShflCore().init(albums);

      const recentGuides = this.shflCore.getPool().slice(0, 5).map(album => ({
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
      this.filterByCategory(''); // 重置筛选
    } else {
      this.setData({ selectedCategory: category });
      this.filterByCategory(category); // 按分类筛选
    }
  },

  // 按分类筛选专辑（复用 ShflCore 的过滤池，保证列表与 shuffle 一致）
  filterByCategory(category) {
    if (!this.shflCore) {
      wx.showToast({ title: '数据未加载', icon: 'none' });
      return;
    }

    this.shflCore.setCategory(category);
    const filtered = this.shflCore.getPool().map(album => ({
      id: album._id,
      title: album.title,
      artist: album.artist,
      image: album.coverUrl
    }));

    this.setData({ recentGuides: filtered });
  },

  onShuffleTap() {
    // 按钮动画效果
    this.setData({ isShuffling: true });

    // 使用更优雅的加载提示
    wx.showLoading({
      title: '正在寻找好音乐...',
      mask: true
    });

    if (!this.shflCore) {
      wx.hideLoading();
      this.setData({ isShuffling: false });
      wx.showToast({ title: '数据未加载', icon: 'none' });
      return;
    }

    // 执行 Shfl 核心循环：从核心中选出下一张专辑
    const nextAlbum = this.shflCore.next();

    wx.hideLoading();

    if (!nextAlbum) {
      this.setData({ isShuffling: false });
      wx.showToast({ title: '暂无推荐', icon: 'none' });
      return;
    }

    // 添加延迟让过渡更自然
    setTimeout(() => {
      this.setData({ isShuffling: false });
      const category = this.shflCore ? this.shflCore.getCategory() : '';
      const url = category
        ? `/pages/detail/index?id=${nextAlbum._id}&category=${encodeURIComponent(category)}`
        : `/pages/detail/index?id=${nextAlbum._id}`;
      wx.navigateTo({ url });
    }, 800);
  },

  onAlbumTap(e) {
    const id = e.currentTarget.dataset.id;
    const category = this.data.selectedCategory;
    const url = category
      ? `/pages/detail/index?id=${id}&category=${encodeURIComponent(category)}`
      : `/pages/detail/index?id=${id}`;
    wx.navigateTo({ url });
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
    const defaultImage = 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ac/No_image_available.svg/300px-No_image_available.svg.png';

    // 更新对应索引的图片为默认图
    const recentGuides = this.data.recentGuides;
    if (recentGuides[index]) {
      recentGuides[index].image = defaultImage;
      this.setData({ recentGuides });
    }
  }
});
