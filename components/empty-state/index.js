Component({
  properties: {
    // 空状态类型：empty | error | network | search
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
        icon: '📭',
        title: '暂无数据',
        description: '这里还没有内容哦',
        buttonText: '刷新试试'
      },
      error: {
        icon: '⚠️',
        title: '出错了',
        description: '加载失败，请稍后重试',
        buttonText: '重新加载'
      },
      network: {
        icon: '📡',
        title: '网络异常',
        description: '请检查网络连接后重试',
        buttonText: '重新连接'
      },
      search: {
        icon: '🔍',
        title: '没有找到结果',
        description: '换个关键词试试',
        buttonText: '清除搜索'
      }
    }
  },

  methods: {
    onButtonTap() {
      this.triggerEvent('retry');
    }
  }
});
