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
      this.setData({
        displayValue: `${result}`,
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
    
    this.setData({
      displayValue: `${result}`,
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
    const value = parseFloat(this.data.displayValue);
    this.setData({
      displayValue: `${-value}`
    });
  },

  handlePercent() {
    const value = parseFloat(this.data.displayValue);
    this.setData({
      displayValue: `${value / 100}`
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
    switch (operator) {
      case '+':
        return firstOperand + secondOperand;
      case '-':
        return firstOperand - secondOperand;
      case '×':
        return firstOperand * secondOperand;
      case '÷':
        return firstOperand / secondOperand;
      default:
        return secondOperand;
    }
  }
}); 