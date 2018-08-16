class Timer {
  constructor() {
    this.timer = null
  }
  timeoutCreator(delay, callback) {
    this.timer = setTimeout(() => {
      callback && callback()
      clearTimeout(this.timer)
      this.timer = null
    }, delay)
  }
  clearTimer() {
    clearTimeout(this.timer)
    this.timer = null
  }
}

module.exports = Timer