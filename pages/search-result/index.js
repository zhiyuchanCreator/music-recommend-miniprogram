Page({
  data: {
    keyword: '',
    results: [],
    loading: false
  },

  onLoad(options) {
    const { keyword } = options;
    if (keyword) {
      this.setData({ keyword });
      this.search(keyword);
    }
  },

  search(keyword) {
    this.setData({ loading: true });
    
    const db = wx.cloud.database();
    const _ = db.command;

    db.collection('albums')
      .where(_.or([
        { title: db.RegExp({ regexp: keyword, options: 'i' }) },
        { artist: db.RegExp({ regexp: keyword, options: 'i' }) }
      ]))
      .get()
      .then(res => {
        // 去重：根据 id 去重
        const uniqueResults = [];
        const seenIds = new Set();
        
        res.data.forEach(album => {
          if (!seenIds.has(album._id)) {
            seenIds.add(album._id);
            uniqueResults.push({
              id: album._id,
              title: album.title,
              artist: album.artist,
              image: album.coverUrl
            });
          }
        });
        
        this.setData({ 
          results: uniqueResults,
          loading: false
        });
      })
      .catch(err => {
        console.error('[Search] Failed:', err);
        this.setData({ loading: false });
        wx.showToast({ title: '搜索失败', icon: 'error' });
      });
  },

  onAlbumTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  },

  onBackTap() {
    wx.navigateBack();
  }
});
