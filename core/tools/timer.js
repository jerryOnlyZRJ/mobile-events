class Timer {
  constructor() {
    this.timer = null
  }
  timeoutCreator(delay, callback) {
    this.timer = setTimeout(() => {
      clearTimeout(this.timer)
      this.timer = null
      return callback && callback()
    }, delay)
  }
  clearTimer() {
    clearTimeout(this.timer)
    this.timer = null
  }
}

module.exports = Timer