Component({
  properties: {
    // 骨架屏类型：home | detail
    type: {
      type: String,
      value: 'home'
    },
    // 是否显示
    loading: {
      type: Boolean,
      value: true
    }
  },

  data: {
    // 骨架屏动画
    animation: ''
  },

  lifetimes: {
    attached() {
      this.startShimmer();
    }
  },

  methods: {
    // 启动闪烁动画
    startShimmer() {
      const animation = wx.createAnimation({
        duration: 1500,
        timingFunction: 'linear',
        delay: 0
      });
      
      const animate = () => {
        animation.opacity(0.5).step({ duration: 750 });
        animation.opacity(1).step({ duration: 750 });
        this.setData({ animation: animation.export() });
      };
      
      animate();
      this.shimmerTimer = setInterval(animate, 1500);
    }
  },

  detached() {
    if (this.shimmerTimer) {
      clearInterval(this.shimmerTimer);
    }
  }
});
