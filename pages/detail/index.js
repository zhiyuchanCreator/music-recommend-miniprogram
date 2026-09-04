const { create: createShflCore } = require('../../utils/shfl-core.js');

Page({
  data: {
    album: null,
    genreTags: [],
    trackList: [],
    loading: true,
    isFavorite: false,
    albumId: '',
    category: '', // 当前分类过滤
    showHeaderBg: false, // 控制导航栏背景
    isDescExpanded: false, // 简介是否展开
    showExpandBtn: false, // 是否显示展开按钮
    similarAlbums: [], // 相似推荐
    isShuffling: false, // 再 Shfl 一次加载状态
    showRetryTip: false // 加载失败时显示的临时提示
  },

  onLoad(options) {
    const { id, category } = options;
    if (id) {
      this.setData({ albumId: id, category: category || '' });
      this.loadAlbumDetail(id);
      this.checkFavoriteStatus(id);
      this.addToHistory(id);
    } else {
      wx.showToast({ title: '参数错误', icon: 'error' });
    }
    this.lastScrollTop = 0;
  },

  onUnload() {
    this._isUnloaded = true;
  },

  // 页面滚动监听
  onPageScroll(e) {
    const scrollTop = e.scrollTop;

    // 控制导航栏背景显示
    if (scrollTop > 300 && !this.data.showHeaderBg) {
      this.setData({ showHeaderBg: true });
    } else if (scrollTop <= 300 && this.data.showHeaderBg) {
      this.setData({ showHeaderBg: false });
    }

    this.lastScrollTop = scrollTop;
  },

  // 加载专辑详情
  loadAlbumDetail(id) {
    const db = wx.cloud.database();

    db.collection('albums')
      .doc(id)
      .get()
      .then(res => {
        const album = res.data;
        // 解析 genre 字符串为数组（兼容逗号分隔字符串和数组格式）
        const genreTags = Array.isArray(album.genre)
          ? album.genre
          : (album.genre ? album.genre.split(',').map(g => g.trim()).filter(g => g) : []);
        // 解析 tracks 字符串为数组（兼容竖线分隔字符串和数组格式）
        const trackList = Array.isArray(album.tracks)
          ? album.tracks
          : (album.tracks ? album.tracks.split('|').map(t => t.trim()).filter(t => t) : []);
        this.setData({
          album: album,
          genreTags: genreTags,
          trackList: trackList,
          loading: false
        });

        // 检查是否需要显示展开按钮
        this.checkDescHeight();

        // 加载相似推荐
        this.loadSimilarAlbums(album);
      })
      .catch(err => {
        console.error('加载详情失败:', err);
        this.setData({ loading: false, showRetryTip: true });
        // 延迟 10 秒再跳转全局错误页，避免连续跳转过于突兀
        setTimeout(() => {
          if (this._isUnloaded) return;
          this.setData({ showRetryTip: false });
          wx.navigateTo({
            url: `/pages/error/index?redirect=${encodeURIComponent('/pages/detail/index?id=' + this.data.albumId)}`
          });
        }, 10000);
      });
  },

  // 检查简介高度
  checkDescHeight() {
    // 如果简介超过100字符，显示展开按钮
    const { album } = this.data;
    if (album && album.description && album.description.length > 100) {
      this.setData({ showExpandBtn: true });
    }
  },

  // 切换简介展开/收起
  toggleDesc() {
    this.setData({
      isDescExpanded: !this.data.isDescExpanded
    });
  },

  // 加载相似推荐
  loadSimilarAlbums(currentAlbum) {
    const db = wx.cloud.database();
    const rawGenre = currentAlbum.genre || '';
    const genres = Array.isArray(rawGenre)
      ? rawGenre
      : (rawGenre ? rawGenre.split(',').map(g => g.trim()).filter(g => g) : []);

    if (genres.length === 0) {
      db.collection('albums').limit(6).get()
        .then(res => {
          const similar = res.data
            .filter(item => item._id !== currentAlbum._id)
            .slice(0, 5)
            .map(item => ({
              id: item._id,
              title: item.title,
              artist: item.artist,
              coverUrl: item.coverUrl
            }));
          this.setData({ similarAlbums: similar });
        })
        .catch(err => {
          console.error('加载相似推荐失败:', err);
        });
      return;
    }

    // 按 genre 层级逐个查询，最多取前3个标签
    const queryGenres = genres.slice(0, 3);
    const currentGenreSet = new Set(genres.map(g => g.toLowerCase()));

    const queries = queryGenres.map(genre =>
      db.collection('albums')
        .where({
          genre: db.RegExp({
            regexp: genre,
            options: 'i'
          })
        })
        .limit(20)
        .get()
    );

    Promise.all(queries)
      .then(results => {
        const albumMap = new Map();

        results.forEach((res, queryIndex) => {
          res.data.forEach(item => {
            if (item._id === currentAlbum._id || albumMap.has(item._id)) return;

            // 计算与当前专辑的 genre 重叠数
            const rawItemGenre = item.genre || '';
            const itemGenres = Array.isArray(rawItemGenre)
              ? rawItemGenre
              : (rawItemGenre ? rawItemGenre.split(',').map(g => g.trim()).filter(g => g) : []);
            const overlap = itemGenres.filter(g =>
              currentGenreSet.has(g.toLowerCase())
            ).length;

            albumMap.set(item._id, {
              item,
              overlapScore: overlap,
              firstMatchIndex: queryIndex
            });
          });
        });

        // 排序：genre 重叠越多越靠前，相同时优先匹配更靠前的 genre 标签
        const sorted = Array.from(albumMap.values()).sort((a, b) => {
          if (b.overlapScore !== a.overlapScore) {
            return b.overlapScore - a.overlapScore;
          }
          return a.firstMatchIndex - b.firstMatchIndex;
        });

        const similar = sorted.slice(0, 5).map(({ item }) => ({
          id: item._id,
          title: item.title,
          artist: item.artist,
          coverUrl: item.coverUrl
        }));

        this.setData({ similarAlbums: similar });
      })
      .catch(err => {
        console.error('加载相似推荐失败:', err);
      });
  },

  // 检查收藏状态
  checkFavoriteStatus(albumId) {
    const favorites = wx.getStorageSync('favorites') || [];
    const isFavorite = favorites.some(item => item.id === albumId);
    this.setData({ isFavorite });
  },

  // 添加到浏览历史
  addToHistory(albumId) {
    let history = wx.getStorageSync('history') || [];

    // 移除重复项
    history = history.filter(item => item.id !== albumId);

    // 添加到开头
    history.unshift({
      id: albumId,
      timestamp: Date.now()
    });

    // 最多保留50条
    if (history.length > 50) {
      history = history.slice(0, 50);
    }

    wx.setStorageSync('history', history);
  },

  // 切换收藏状态
  onFavoriteTap() {
    const { albumId, album, isFavorite } = this.data;

    if (!album) return;

    let favorites = wx.getStorageSync('favorites') || [];

    if (isFavorite) {
      // 取消收藏
      favorites = favorites.filter(item => item.id !== albumId);
      wx.showToast({ title: '已取消收藏', icon: 'success' });
    } else {
      // 添加收藏
      favorites.push({
        id: albumId,
        title: album.title,
        artist: album.artist,
        coverUrl: album.coverUrl,
        timestamp: Date.now()
      });
      wx.showToast({ title: '收藏成功', icon: 'success' });
    }

    wx.setStorageSync('favorites', favorites);
    this.setData({ isFavorite: !isFavorite });
  },

  // 播放专辑 - 显示平台选择
  onPlayTap() {
    this.showPlatformSelector('album');
  },

  // 播放单曲 - 显示平台选择
  onTrackTap(e) {
    const index = e.currentTarget.dataset.index;
    const { trackList } = this.data;
    const trackName = trackList[index];
    
    this.setData({ currentTrack: trackName });
    this.showPlatformSelector('track', trackName);
  },

  // 显示平台选择弹窗
  showPlatformSelector(type, trackName = '') {
    const { album } = this.data;
    const searchKeyword = type === 'album' 
      ? `${album.title} ${album.artist}` 
      : `${trackName} ${album.artist}`;
    
    const platforms = [
      {
        id: 'netease',
        name: '网易云音乐',
        icon: '/images/icons/netease-music.png',
        color: '#C20C0C',
        url: `orpheus://search/${encodeURIComponent(searchKeyword)}`
      },
      {
        id: 'qq',
        name: 'QQ音乐',
        icon: '/images/icons/qq-music.png',
        color: '#31C27C',
        url: `qqmusic://qq.com/search?keyword=${encodeURIComponent(searchKeyword)}`
      }
    ];

    this.setData({
      showPlatformModal: true,
      platforms: platforms,
      searchKeyword: searchKeyword,
      currentTrack: trackName
    });
  },

  // 关闭平台选择弹窗
  closePlatformModal() {
    this.setData({ showPlatformModal: false });
  },

  // 选择平台跳转
  // 策略：先复制搜索词到剪贴板（无论是否跳转都做），再用真实可用的跳转方式打开目标平台
  // 1. 有 shortLink：用 shortLink 跳转（无需 appId，最稳）
  // 2. 有 appId：用 appId 跳转（注意 path 可能是猜的，跳转后可能落到对方首页）
  // 3. 都没有：弹 modal 提示用户手动去 App 搜索（关键词已复制）
  onPlatformSelect(e) {
    const { platform } = e.currentTarget.dataset;
    const { searchKeyword } = this.data;

    this.closePlatformModal();

    const shortLink = this.getShortLink(platform.id);
    const appId = this.getAppId(platform.id);

    if (shortLink) {
      // 优先用 shortLink 跳转
      wx.navigateToMiniProgram({
        shortLink: shortLink,
        success: () => {
          console.log('[跳转成功] shortLink:', platform.name);
          this.copyKeywordWithToast(searchKeyword, '已复制，请粘贴搜索');
        },
        fail: (err) => {
          console.error('[跳转失败] shortLink:', platform.name, err);
          this.copyKeywordWithToast(searchKeyword, '关键词已复制，请手动前往App搜索');
        }
      });
    } else if (appId) {
      // 其次用 appId 跳转
      wx.navigateToMiniProgram({
        appId: appId,
        path: this.getMiniProgramPath(platform.id, searchKeyword),
        success: () => {
          console.log('[跳转成功] appId:', platform.name);
          this.copyKeywordWithToast(searchKeyword, '已复制，请粘贴搜索');
        },
        fail: (err) => {
          console.error('[跳转失败] appId:', platform.name, err);
          this.copyKeywordWithToast(searchKeyword, '关键词已复制，请手动前往App搜索');
        }
      });
    } else {
      // 兜底：弹 modal 让用户主动复制
      wx.showModal({
        title: platform.name,
        content: `${platform.name} 暂不支持直接跳转，是否复制搜索关键词？`,
        confirmText: '复制关键词',
        cancelText: '取消',
        success: (res) => {
          if (res.confirm) {
            this.copyKeywordWithToast(searchKeyword, '已复制，请前往APP搜索');
          }
        }
      });
    }
  },

  // 复制搜索关键词并 toast
  copyKeywordWithToast(keyword, message) {
    wx.setClipboardData({
      data: keyword,
      success: () => {
        wx.showToast({ title: message, icon: 'none', duration: 2000 });
      }
    });
  },

  // 获取小程序AppId
  // 公开渠道（包括 QQ 音乐开放平台、第三方 appId 列表）都无法拿到稳定的 appId，
  // 实测网易云/QQ音乐的 appId 都报 invalid appid。
  // 因此暂时全部置空，所有平台走"复制搜索词"路径（详见 onPlatformSelect 的 else 分支）。
  // 后续如果你能拿到真实 shortLink（微信 → 目标小程序 → ⋯ → 复制链接），
  // 可以填到下面 shortLinks 里，恢复跳转体验。
  getAppId(platformId) {
    const appIds = {
      'netease': '',
      'qq': ''
    };
    return appIds[platformId] || '';
  },

  // shortLink 兜底跳转（基础库 2.18.1+）
  // 填入方式：在微信里打开目标小程序 → 右上角 ⋯ → 复制链接，把整条链接粘到对应字段。
  getShortLink(platformId) {
    const shortLinks = {
      'netease': '#小程序://网易云音乐听歌/rY4Uw5mPyMRfHoB',  // 注意：这是"网易云音乐听歌"小程序，不是"网易云音乐"主小程序
      'qq': '#小程序://QQ音乐/TthLgLYYaLreVbH'
    };
    return shortLinks[platformId] || '';
  },

  // 获取小程序路径
  // 注意：path 是猜的，对方小程序不一定有此页面。
  // 如果跳转后落到对方首页而不是搜索页，说明 path 不对，删掉 path 让它跳首页即可。
  getMiniProgramPath(platformId, keyword) {
    const paths = {
      'netease': `pages/search/index?keyword=${encodeURIComponent(keyword)}`,
      'qq': `pages/search/index?keyword=${encodeURIComponent(keyword)}`
    };
    return paths[platformId] || '';
  },

  // 显示备选方案
  showFallbackOptions(platform, keyword) {
    wx.showModal({
      title: '跳转提示',
      content: `是否复制搜索关键词，前往${platform.name}搜索？`,
      confirmText: '复制并搜索',
      cancelText: '取消',
      success: (res) => {
        if (res.confirm) {
          wx.setClipboardData({
            data: keyword,
            success: () => {
              wx.showToast({
                title: '已复制',
                icon: 'success'
              });
            }
          });
        }
      }
    });
  },

  // 复制搜索关键词
  onCopyKeyword() {
    const { searchKeyword } = this.data;
    wx.setClipboardData({
      data: searchKeyword,
      success: () => {
        wx.showToast({
          title: '搜索词已复制',
          icon: 'success'
        });
        this.closePlatformModal();
      }
    });
  },

  // 阻止事件冒泡
  preventClose() {
    // 什么都不做，只是阻止冒泡
  },

  // 点击相似推荐
  onSimilarTap(e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: `/pages/detail/index?id=${id}`
    });
  },

  // 分享给朋友
  onShareAppMessage() {
    const { album } = this.data;
    if (!album) return {};

    return {
      title: `${album.title} - ${album.artist}`,
      path: `/pages/detail/index?id=${this.data.albumId}`,
      imageUrl: album.coverUrl
    };
  },

  // 分享到朋友圈
  onShareTimeline() {
    const { album } = this.data;
    if (!album) return {};

    return {
      title: `${album.title} - ${album.artist}`,
      query: `id=${this.data.albumId}`,
      imageUrl: album.coverUrl
    };
  },

  // 点击分享按钮
  onShareTap() {
    wx.showShareMenu({
      withShareTicket: true,
      menus: ['shareAppMessage', 'shareTimeline']
    });
  },

  // 再 Shfl 一次：复用 ShflCore 循环
  onShuffleTap() {
    if (this.data.isShuffling) return;

    this.setData({ isShuffling: true });
    wx.showLoading({ title: '正在寻找好音乐...', mask: true });

    wx.cloud.callFunction({ name: 'getAlbums' })
      .then(res => {
        const result = res.result;
        if (!result.success || !result.albums || result.albums.length === 0) {
          throw new Error('暂无推荐数据');
        }

        const shflCore = createShflCore().init(result.albums);
        if (this.data.category) {
          shflCore.setCategory(this.data.category);
        }

        // 把当前专辑标记为已看过，避免立即又摇到同一张
        const currentAlbum = this.data.album;
        if (currentAlbum) {
          shflCore.markSeen(currentAlbum);
        }

        const nextAlbum = shflCore.next();
        wx.hideLoading();
        this.setData({ isShuffling: false });

        if (!nextAlbum) {
          wx.showToast({ title: '暂无推荐', icon: 'none' });
          return;
        }

        const url = this.data.category
          ? `/pages/detail/index?id=${nextAlbum._id}&category=${encodeURIComponent(this.data.category)}`
          : `/pages/detail/index?id=${nextAlbum._id}`;

        // 用 redirectTo 替换当前详情页，避免页面堆叠过深
        wx.redirectTo({ url });
      })
      .catch(err => {
        wx.hideLoading();
        this.setData({ isShuffling: false });
        console.error('[Detail] Shuffle failed:', err);
        wx.showToast({ title: '推荐失败', icon: 'error' });
      });
  },

  onBackTap() {
    wx.navigateBack();
  }
});
