// index.js
const defaultAvatarUrl = 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0'

Page({
  data: {
    tools: [
      {
        id: 'calculator',
        icon: '🔢',
        name: '计算器',
        description: '仿苹果风格计算器',
        developed: true
      },
      {
        id: 'protractor',
        icon: '📐',
        name: '量角器',
        description: '测量物体倾斜角度',
        developed: true
      },
      {
        id: 'flashlight',
        icon: '🔦',
        name: '手电筒',
        description: '可调节亮度和颜色',
        developed: true
      },
      {
        id: 'ruler',
        icon: '📏',
        name: '数字尺子',
        description: '敬请期待',
        developed: false
      },
      {
        id: 'compass',
        icon: '🧭',
        name: '指南针',
        description: '电子指南针工具',
        developed: true
      },
      {
        id: 'level',
        icon: '📊',
        name: '水平仪',
        description: '敬请期待',
        developed: false
      }
    ]
  },

  navigateToTool(e) {
    const toolId = e.currentTarget.dataset.id;
    const tool = this.data.tools.find(t => t.id === toolId);
    
    if (!tool.developed) {
      wx.showToast({
        title: '功能开发中',
        icon: 'none'
      });
      return;
    }
    
    wx.navigateTo({
      url: `/pages/${toolId}/index`
    });
  }
});
