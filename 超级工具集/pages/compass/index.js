Page({
  data: {
    direction: 0,        // 当前方向角度
    heading: 'N',        // 当前方向文字
    isCalibrating: false // 是否在校准
  },

  onLoad() {
    // 检查设备是否支持罗盘功能
    wx.stopCompass({
      success: () => {
        this.startCompass();
      }
    });
  },

  onUnload() {
    // 页面卸载时停止罗盘监听
    wx.stopCompass();
  },

  startCompass() {
    wx.startCompass({
      success: () => {
        // 监听罗盘数据
        wx.onCompassChange((res) => {
          // 将方向角度转换为正确的方位角（北为0度，顺时针增加）
          let direction = (360 - res.direction).toFixed(1);
          // 确保角度在0-360范围内
          if (direction >= 360) direction -= 360;
          if (direction < 0) direction += 360;
          const heading = this.getHeading(direction);
          
          this.setData({
            direction: direction,
            heading: heading
          });
        });
      },
      fail: () => {
        wx.showToast({
          title: '请打开设备的指南针权限',
          icon: 'none'
        });
      }
    });
  },

  // 根据角度获取方向文字
  getHeading(direction) {
    if (direction >= 337.5 || direction < 22.5) return 'N';
    if (direction >= 22.5 && direction < 67.5) return 'NE';
    if (direction >= 67.5 && direction < 112.5) return 'E';
    if (direction >= 112.5 && direction < 157.5) return 'SE';
    if (direction >= 157.5 && direction < 202.5) return 'S';
    if (direction >= 202.5 && direction < 247.5) return 'SW';
    if (direction >= 247.5 && direction < 292.5) return 'W';
    if (direction >= 292.5 && direction < 337.5) return 'NW';
    return 'N';
  },

  // 显示帮助信息
  showHelp() {
    wx.showModal({
      title: '指南针使用说明',
      content: '1. 红色箭头指向北方\n2. 屏幕顶部显示当前方向和角度\n3. 如果发现指向不准，请点击"校准指南针"按钮\n4. 校准时请远离磁场干扰，并做8字形移动',
      showCancel: false,
      confirmText: '我知道了'
    });
  },

  // 校准罗盘
  calibrateCompass() {
    this.setData({
      isCalibrating: true
    });
    
    // 停止当前的罗盘监听
    wx.stopCompass();
    
    wx.showModal({
      title: '校准指南针',
      content: '请将设备远离磁场干扰，并做8字形移动进行校准',
      showCancel: false,
      success: () => {
        // 重新启动罗盘
        this.startCompass();
        this.setData({
          isCalibrating: false
        });
      }
    });
  }
}); 