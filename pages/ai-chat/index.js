const MSG_TTL = 50; // 最多保留消息数

Page({
  data: {
    messages: [],      // { id, role: 'user'|'assistant', content, albums: [] }
    inputValue: '',
    isLoading: false,
    scrollIntoId: '',
    samples: [
      '想听适合深夜写代码的专辑',
      '爵士乐入门该从哪张听起',
      '来点 90 年代的 Hip Hop',
      '心情低落，想要治愈系的音乐'
    ]
  },

  _msgSeq: 0,

  onInput(e) {
    this.setData({ inputValue: e.detail.value });
  },

  onSampleTap(e) {
    this.setData({ inputValue: e.currentTarget.dataset.question });
    this.onSend();
  },

  onSend() {
    const question = this.data.inputValue.trim();
    if (!question) {
      wx.showToast({ title: '先说点什么吧', icon: 'none' });
      return;
    }
    if (this.data.isLoading) return;

    this.appendMessage('user', question, []);
    this.setData({ inputValue: '', isLoading: true });
    this.scrollToEnd();

    wx.cloud.callFunction({
      name: 'ragChat',
      data: { question }
    })
      .then(res => {
        const result = res.result || {};
        if (result.success) {
          this.appendMessage('assistant', result.answer, result.albums || []);
        } else {
          this.appendMessage('assistant', result.errMsg || '探索失败，请稍后再试。', []);
        }
      })
      .catch(err => {
        console.error('[AIChat] ragChat 调用失败:', err);
        this.appendMessage('assistant', '网络好像开小差了，稍后再试试？', []);
      })
      .finally(() => {
        this.setData({ isLoading: false });
      });
  },

  appendMessage(role, content, albums) {
    const id = ++this._msgSeq;
    const messages = this.data.messages.concat({ id, role, content, albums });
    if (messages.length > MSG_TTL) {
      messages = messages.slice(-MSG_TTL);
    }
    this.setData({ messages });
    this.scrollToEnd();
  },

  scrollToEnd() {
    // 等待渲染完成后滚动到最后一条消息
    wx.nextTick(() => {
      setTimeout(() => {
        const messages = this.data.messages;
        if (messages.length > 0) {
          this.setData({ scrollIntoId: `msg-${messages[messages.length - 1].id}` });
        }
      }, 100);
    });
  },

  onAlbumTap(e) {
    wx.navigateTo({
      url: `/pages/detail/index?id=${e.currentTarget.dataset.id}&from=ai-chat`
    });
  }
});
