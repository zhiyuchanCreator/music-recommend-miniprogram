Component({
  properties: {
    // 空状态类型：empty | error | network | search | offline | fatal
    type: {
      type: String,
      value: 'empty'
    },
    // 自定义标题
    title: {
      type: String,
      value: ''
    },
    // 自定义描述
    description: {
      type: String,
      value: ''
    },
    // 是否显示按钮
    showButton: {
      type: Boolean,
      value: true
    },
    // 按钮文字
    buttonText: {
      type: String,
      value: ''
    }
  },

  data: {
    // 预设配置
    config: {
      empty: {
        icon: '🍃',
        title: '这里还没有内容',
        description: '换个分类或稍后再来看看吧',
        buttonText: '刷新试试'
      },
      error: {
        icon: '🔧',
        title: '服务暂时不可用',
        description: '可能是服务器累了，稍后再试试吧',
        buttonText: '刷新试试'
      },
      network: {
        icon: '🌧️',
        title: '网络开小差了',
        description: '检查一下网络，我们马上回来',
        buttonText: '重新加载'
      },
      offline: {
        icon: '📦',
        title: '已为你加载本地推荐',
        description: '当前网络不太稳，显示的是离线内容',
        buttonText: '重新联网'
      },
      search: {
        icon: '🔍',
        title: '没找到相关结果',
        description: '换个关键词试试',
        buttonText: '清除搜索'
      },
      fatal: {
        icon: '😶',
        title: '页面加载失败了',
        description: '可能是网络或服务器开小差，刷新一下试试',
        buttonText: '刷新页面'
      }
    }
  },

  methods: {
    onButtonTap() {
      this.triggerEvent('retry');
    }
  }
});
