/**
 * Shfl 核心循环
 *
 * 职责：
 * 1. 维护候选专辑池（全量 / 按分类过滤）
 * 2. 提供智能 shuffle：基于评分加权，并惩罚最近展示过的专辑，避免短期重复
 * 3. 记录 shuffle 历史，支持本地持久化
 * 4. 作为首页、详情页等各处“下一张推荐”的统一入口
 */

const HISTORY_KEY = 'shfl_history_v1';
const DEFAULT_MAX_HISTORY = 20;

class ShflCore {
  constructor(options = {}) {
    this.pool = [];
    this.filteredPool = [];
    this.history = [];
    this.current = null;

    this.categoryFilter = '';
    this.maxHistory = options.maxHistory || DEFAULT_MAX_HISTORY;
    this.ratingBoost = options.ratingBoost !== false;
    this.recencyPenalty = options.recencyPenalty !== false;
  }

  /**
   * 初始化专辑池
   * @param {Array} albums 专辑数组
   */
  init(albums) {
    this.pool = Array.isArray(albums) ? albums.slice() : [];
    this._applyFilter();
    this._loadHistory();
    return this;
  }

  /**
   * 设置分类过滤条件；空字符串表示不过滤
   * @param {string} category
   */
  setCategory(category) {
    this.categoryFilter = (category || '').toString().trim();
    this._applyFilter();
    return this;
  }

  /**
   * 获取当前分类
   */
  getCategory() {
    return this.categoryFilter;
  }

  /**
   * 执行一次 Shfl：按权重随机选出下一张专辑
   * @returns {Object|null} 选中的专辑对象，无候选时返回 null
   */
  next() {
    if (this.filteredPool.length === 0) {
      return null;
    }

    // 单张专辑时直接返回
    if (this.filteredPool.length === 1) {
      this.current = this.filteredPool[0];
      this._pushHistory(this.current);
      return this.current;
    }

    const candidates = this.filteredPool.map(album => {
      let weight = 1;

      // 评分加权：rating 越高，基础权重越高
      if (this.ratingBoost && typeof album.rating === 'number') {
        weight += (album.rating / 100) * 2;
      }

      // 近期惩罚：最近出现过的专辑权重降低
      if (this.recencyPenalty) {
        const historyIndex = this.history.findIndex(h => h.id === album._id);
        if (historyIndex !== -1) {
          const recency = (this.history.length - historyIndex) / this.history.length;
          weight *= Math.max(0.05, 1 - recency * 0.95);
        }
      }

      return { album, weight };
    });

    const totalWeight = candidates.reduce((sum, c) => sum + c.weight, 0);
    let random = Math.random() * totalWeight;
    let selected = candidates[0].album;

    for (const candidate of candidates) {
      random -= candidate.weight;
      if (random <= 0) {
        selected = candidate.album;
        break;
      }
    }

    this.current = selected;
    this._pushHistory(selected);
    return selected;
  }

  /**
   * 获取当前选中的专辑
   */
  getCurrent() {
    return this.current;
  }

  /**
   * 获取当前候选池（已应用分类过滤）
   */
  getPool() {
    return this.filteredPool.slice();
  }

  /**
   * 获取 shuffle 历史
   */
  getHistory() {
    return this.history.slice();
  }

  /**
   * 清空历史
   */
  clearHistory() {
    this.history = [];
    this._saveHistory();
    return this;
  }

  /**
   * 将专辑标记为已看过（加入历史，但不改变 current）
   * @param {Object} album
   */
  markSeen(album) {
    this._pushHistory(album);
    return this;
  }

  /**
   * 重置整个核心状态（保留专辑池）
   */
  reset() {
    this.current = null;
    this.clearHistory();
    return this;
  }

  /**
   * 应用分类过滤
   */
  _applyFilter() {
    if (!this.categoryFilter) {
      this.filteredPool = this.pool.slice();
      return;
    }

    const filter = this.categoryFilter.toLowerCase();
    this.filteredPool = this.pool.filter(album => {
      const genre = String(album.genre || '').toLowerCase();
      return genre.includes(filter);
    });
  }

  /**
   * 将专辑加入历史
   */
  _pushHistory(album) {
    if (!album || !album._id) return;

    this.history = this.history.filter(h => h.id !== album._id);
    this.history.push({
      id: album._id,
      title: album.title,
      artist: album.artist,
      coverUrl: album.coverUrl,
      timestamp: Date.now()
    });

    if (this.history.length > this.maxHistory) {
      this.history = this.history.slice(-this.maxHistory);
    }

    this._saveHistory();
  }

  _loadHistory() {
    try {
      const history = wx.getStorageSync(HISTORY_KEY);
      if (Array.isArray(history)) {
        this.history = history;
      }
    } catch (err) {
      console.error('[ShflCore] 加载历史失败:', err);
    }
  }

  _saveHistory() {
    try {
      wx.setStorageSync(HISTORY_KEY, this.history);
    } catch (err) {
      console.error('[ShflCore] 保存历史失败:', err);
    }
  }
}

module.exports = {
  ShflCore,
  create(options) {
    return new ShflCore(options);
  }
};
