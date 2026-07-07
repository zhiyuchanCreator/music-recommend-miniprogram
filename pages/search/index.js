const SEARCH_HISTORY_KEY = 'search_history';

Page({
  data: {
    searchKeyword: '',
    searchHistory: []
  },

  onLoad() {
    this.loadSearchHistory();
  },

  onShow() {
    // 每次显示页面时刷新历史记录
    this.loadSearchHistory();
  },

  // 加载搜索历史
  loadSearchHistory() {
    try {
      const history = wx.getStorageSync(SEARCH_HISTORY_KEY) || [];
      this.setData({ searchHistory: history });
    } catch (err) {
      console.error('Failed to load search history:', err);
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
      console.error('Failed to save search history:', err);
    }
  },

  // 输入处理
  onSearchInput(e) {
    this.setData({ searchKeyword: e.detail.value });
  },

  // 执行搜索
  onSearch() {
    // 防止重复点击
    if (this.isSearching) return;
    this.isSearching = true;
    
    const keyword = this.data.searchKeyword.trim();
    if (!keyword) {
      wx.showToast({ title: '请输入关键词', icon: 'none' });
      this.isSearching = false;
      return;
    }

    // 保存搜索历史
    this.saveSearchHistory(keyword);
    
    // 跳转到搜索结果页
    wx.redirectTo({
      url: `/pages/search-result/index?keyword=${encodeURIComponent(keyword)}`
    });
    
    // 300ms后重置标志
    setTimeout(() => {
      this.isSearching = false;
    }, 300);
  },

  // 点击历史记录搜索
  onHistoryItemTap(e) {
    // 防止重复点击
    if (this.isSearching) return;
    this.isSearching = true;
    
    const keyword = e.currentTarget.dataset.keyword;
    this.setData({ searchKeyword: keyword });
    
    // 更新历史顺序（置顶）
    this.saveSearchHistory(keyword);
    
    // 跳转到搜索结果页
    wx.redirectTo({
      url: `/pages/search-result/index?keyword=${encodeURIComponent(keyword)}`
    });
    
    // 300ms后重置标志
    setTimeout(() => {
      this.isSearching = false;
    }, 300);
  },

  // 删除单条历史
  deleteHistoryItem(e) {
    const keyword = e.currentTarget.dataset.keyword;
    let history = this.data.searchHistory.filter(item => item !== keyword);
    
    try {
      wx.setStorageSync(SEARCH_HISTORY_KEY, history);
      this.setData({ searchHistory: history });
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  },

  // 清空搜索历史
  clearSearchHistory() {
    wx.showModal({
      title: '提示',
      content: '确定要清空搜索历史吗？',
      success: (res) => {
        if (res.confirm) {
          try {
            wx.removeStorageSync(SEARCH_HISTORY_KEY);
            this.setData({ searchHistory: [] });
          } catch (err) {
            console.error('Failed to clear search history:', err);
          }
        }
      }
    });
  },

  // 返回上一页
  onBackTap() {
    wx.navigateBack();
  },

  // 清空输入
  onClearTap() {
    this.setData({ searchKeyword: '' });
  }
});
