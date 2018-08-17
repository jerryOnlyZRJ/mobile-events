class Position {
  constructor () {
    this.lastClientX = null
    this.lastClientY = null
  }
  initClientPos (event) {
    this.lastClientX = event.changedTouches[0].clientX
    this.lastClientY = event.changedTouches[0].clientY
  }
  isWithinDistance (event, posX, posY) {
    const thisClientX = event.changedTouches[0].clientX
    const thisClientY = event.changedTouches[0].clientY
    const x = Math.abs(thisClientX - this.lastClientX)
    const y = Math.abs(thisClientY - this.lastClientY)
    if (x <= posX && y <= posY) {
      return true
    } else {
      return false
    }
  }
  resetClientPos () {
    this.lastClientX = null
    this.lastClientY = null
  }
}

module.exports = Position
