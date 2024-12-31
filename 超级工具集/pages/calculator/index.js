Page({
  data: {
    displayValue: '0',
    firstOperand: null,
    waitingForSecondOperand: false,
    currentOperator: null,
    allClear: true
  },

  handleNumber(e) {
    const number = e.currentTarget.dataset.number;
    
    // 限制数字长度，避免显示溢出
    if (this.data.displayValue.length >= 12 && !this.data.waitingForSecondOperand) {
      return;
    }

    if (this.data.waitingForSecondOperand) {
      this.setData({
        displayValue: number,
        waitingForSecondOperand: false,
        allClear: false
      });
    } else {
      this.setData({
        displayValue: this.data.displayValue === '0' ? number : this.data.displayValue + number,
        allClear: false
      });
    }
  },

  handleOperator(e) {
    const nextOperator = e.currentTarget.dataset.operator;
    const inputValue = parseFloat(this.data.displayValue);

    if (this.data.firstOperand === null) {
      this.setData({
        firstOperand: inputValue,
      });
    } else if (!this.data.waitingForSecondOperand) {
      const result = this.calculate(this.data.firstOperand, inputValue, this.data.currentOperator);
      
      // 检查计算结果是否有效
      if (!isFinite(result)) {
        this.setData({
          displayValue: '错误',
          firstOperand: null,
          waitingForSecondOperand: false,
          currentOperator: null
        });
        return;
      }

      this.setData({
        displayValue: this.formatResult(result),
        firstOperand: result,
      });
    }

    this.setData({
      waitingForSecondOperand: true,
      currentOperator: nextOperator
    });
  },

  handleEqual() {
    if (!this.data.firstOperand || this.data.waitingForSecondOperand) {
      return;
    }

    const inputValue = parseFloat(this.data.displayValue);
    const result = this.calculate(this.data.firstOperand, inputValue, this.data.currentOperator);
    
    // 检查计算结果是否有效
    if (!isFinite(result)) {
      this.setData({
        displayValue: '错误',
        firstOperand: null,
        waitingForSecondOperand: false,
        currentOperator: null
      });
      return;
    }

    this.setData({
      displayValue: this.formatResult(result),
      firstOperand: null,
      waitingForSecondOperand: false,
      currentOperator: null
    });
  },

  handleClear() {
    this.setData({
      displayValue: '0',
      firstOperand: null,
      waitingForSecondOperand: false,
      currentOperator: null,
      allClear: true
    });
  },

  handleToggleSign() {
    if (this.data.displayValue !== '0') {
      const value = parseFloat(this.data.displayValue);
      this.setData({
        displayValue: `${-value}`
      });
    }
  },

  handlePercent() {
    const value = parseFloat(this.data.displayValue);
    const result = value / 100;
    this.setData({
      displayValue: this.formatResult(result)
    });
  },

  handleDecimal() {
    if (this.data.waitingForSecondOperand) {
      this.setData({
        displayValue: '0.',
        waitingForSecondOperand: false,
        allClear: false
      });
      return;
    }

    if (this.data.displayValue.indexOf('.') === -1) {
      this.setData({
        displayValue: this.data.displayValue + '.',
        allClear: false
      });
    }
  },

  calculate(firstOperand, secondOperand, operator) {
    // 使用 parseFloat 确保操作数是数字
    firstOperand = parseFloat(firstOperand);
    secondOperand = parseFloat(secondOperand);

    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        if (secondOperand === 0) {
          return Infinity; // 除以零将返回 Infinity，后续会被处理为错误
        }
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  },

  // 新增：格式化结果的方法
  formatResult(number) {
    // 如果是整数，直接返回
    if (Number.isInteger(number)) {
      return number.toString();
    }

    // 处理小数，保留合适的精度
    const result = number.toFixed(10).replace(/\.?0+$/, '');
    
    // 如果结果太长，使用科学计数法
    if (result.length > 12) {
      return number.toExponential(6);
    }
    
    return result;
  }
}); 