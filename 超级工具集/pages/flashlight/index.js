Page({
  data: {
    brightness: 100,
    color: '#FFFFFF',
    showPicker: false,
    rgbValue: {
      r: 255,
      g: 255,
      b: 255
    },
    presetColors: [
      '#FFFFFF', // 白色
      '#FFD700', // 金色
      '#FF6B6B', // 红色
      '#4ECDC4', // 青色
      '#96CEB4', // 绿色
      '#FF9F1C', // 橙色
      '#9B59B6', // 紫色
      '#3498DB', // 蓝色
      '#F1C40F', // 黄色
      '#E74C3C'  // 深红色
    ]
  },

  // 显示/隐藏取色器
  showColorPicker() {
    this.setData({
      showPicker: !this.data.showPicker
    });
  },

  // RGB转HEX
  rgbToHex(r, g, b) {
    return '#' + [r, g, b].map(x => {
      const hex = x.toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  },

  // HEX转RGB
  hexToRgb(hex) {
    // 移除#号
    hex = hex.replace('#', '');
    
    // 将hex转换为rgb
    return {
      r: parseInt(hex.substring(0, 2), 16),
      g: parseInt(hex.substring(2, 4), 16),
      b: parseInt(hex.substring(4, 6), 16)
    };
  },

  // 更新颜色
  updateColor(rgb) {
    const hexColor = this.rgbToHex(rgb.r, rgb.g, rgb.b);
    this.setData({
      color: hexColor,
      rgbValue: rgb
    });
  },

  // RGB分量变化处理
  onRChange(e) {
    const newRgb = {
      r: e.detail.value,
      g: this.data.rgbValue.g,
      b: this.data.rgbValue.b
    };
    this.updateColor(newRgb);
  },

  onGChange(e) {
    const newRgb = {
      r: this.data.rgbValue.r,
      g: e.detail.value,
      b: this.data.rgbValue.b
    };
    this.updateColor(newRgb);
  },

  onBChange(e) {
    const newRgb = {
      r: this.data.rgbValue.r,
      g: this.data.rgbValue.g,
      b: e.detail.value
    };
    this.updateColor(newRgb);
  },

  onLoad() {
    // 保持屏幕常亮
    wx.setKeepScreenOn({
      keepScreenOn: true
    });
    
    // 设置屏幕亮度为最大
    wx.setScreenBrightness({
      value: 1
    });
  },

  onUnload() {
    // 页面卸载时恢复默认设置
    wx.setKeepScreenOn({
      keepScreenOn: false
    });
  },

  onBrightnessChange(e) {
    this.setData({
      brightness: e.detail.value
    });
  },

  onColorSelect(e) {
    const color = e.currentTarget.dataset.color;
    // 将选中的颜色转换为RGB值
    const rgb = this.hexToRgb(color);
    this.setData({
      color: color,
      rgbValue: rgb
    });
  },

  onColorInput(e) {
    this.setData({
      color: e.detail.value
    });
  },

  // 优化对比色计算方法
  getContrastColor(hexcolor) {
    // 移除#号
    hexcolor = hexcolor.replace('#', '');
    
    // 转换为RGB
    const r = parseInt(hexcolor.substring(0, 2), 16);
    const g = parseInt(hexcolor.substring(2, 4), 16);
    const b = parseInt(hexcolor.substring(4, 6), 16);
    
    // 使用相对亮度公式计算（W3C推荐）
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    
    // 添加文字阴影以增加可读性
    this.setData({
      textShadow: luminance > 0.5 ? 
        '0 1px 2px rgba(0,0,0,0.3)' : 
        '0 1px 2px rgba(255,255,255,0.3)'
    });
    
    // 根据亮度返回对比色
    return luminance > 0.5 ? '#000000' : '#FFFFFF';
  }
}); 