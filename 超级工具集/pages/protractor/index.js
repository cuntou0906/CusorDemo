Page({
  data: {
    angle1: 0, // 红色游标角度
    angle2: 90, // 蓝色游标角度
    angleDiff: 90, // 角度差值
    touching: null,
    centerX: 0,
    centerY: 0,
    touchOffset: 0 // 添加触摸偏移量
  },

  onLoad() {
    this.updateAngleDiff();
  },

  onReady() {
    // 获取量角器中心点坐标
    const query = wx.createSelectorQuery();
    query.select('.circle').boundingClientRect();
    query.exec(res => {
      if (res[0]) {
        const rect = res[0];
        this.setData({
          centerX: rect.left + rect.width / 2,
          centerY: rect.top + rect.height / 2
        });
      }
    });
  },

  onTouchStart(e) {
    const cursor = e.currentTarget.dataset.cursor;
    const touch = e.touches[0];
    
    // 计算触摸点的角度
    const touchAngle = this.calculateAngle(touch.pageX, touch.pageY);
    
    // 计算触摸点与当前游标角度的差值
    const currentAngle = this.data[cursor];
    let offset = touchAngle - currentAngle;
    
    // 确保偏移量在合理范围内
    if (offset > 180) offset -= 360;
    if (offset < -180) offset += 360;
    
    this.setData({
      touching: cursor,
      touchOffset: offset
    });
  },

  onTouchMove(e) {
    if (!this.data.touching) return;
    
    const touch = e.touches[0];
    
    // 计算新的角度，考虑触摸偏移量
    const touchAngle = this.calculateAngle(touch.pageX, touch.pageY);
    let newAngle = touchAngle - this.data.touchOffset;
    // 确保角度在 0-360 范围内
    if (newAngle < 0) newAngle += 360;
    if (newAngle >= 360) newAngle -= 360;
    
    // 精确到0.1度
    newAngle = Math.round(newAngle * 10) / 10;
    
    // 更新对应游标的角度
    this.setData({
      [this.data.touching]: newAngle
    });
    
    this.updateAngleDiff();
  },

  onTouchEnd() {
    this.setData({
      touching: null,
      touchOffset: 0
    });
  },

  calculateAngle(x, y) {
    const { centerX, centerY } = this.data;
    
    // 计算相对于中心点的角度
    let angle = Math.atan2(x - centerX, -(y - centerY)) * 180 / Math.PI;
    
    // 确保角度在 0-360 范围内
    if (angle < 0) angle += 360;
    
    // 精确到0.1度
    return Math.round(angle * 10) / 10;
  },

  getAngleDifference(angle1, angle2) {
    let diff = Math.abs(angle1 - angle2);
    diff = diff > 180 ? 360 - diff : diff;
    // 精确到0.1度
    return Math.round(diff * 10) / 10;
  },

  updateAngleDiff() {
    const diff = this.getAngleDifference(this.data.angle1, this.data.angle2);
    this.setData({
      angleDiff: diff
    });
  }
}); 