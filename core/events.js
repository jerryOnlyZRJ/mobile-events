module.exports = {
  longtap: function () {},
  dbtap: function (callback, xrange = 100, yrange = 100) {
    let timer = null
    let lastClientX
    let lastClientY
    return function (e) {
      if (timer) {
        clearTimeout(timer)
        timer = null
        const thisClientX = e.changedTouches[0].clientX
        const thisClientY = e.changedTouches[0].clientY
        const x = Math.abs(thisClientX - lastClientX)
        const y = Math.abs(thisClientY - lastClientY)
        if (x <= xrange && y <= yrange) {
          e.stopPropagation()
          callback(e)
        } else {
          console.log('Double click in different area!')
        }
      } else {
        lastClientX = e.changedTouches[0].clientX
        lastClientY = e.changedTouches[0].clientY
        timer = setTimeout(() => {
          lastClientX = null
          lastClientY = null
          clearTimeout(timer)
          timer = null
          console.log('Single click!')
        }, 500)
      }
    }
  },
  dragup: function () {},
  dragdown: function () {},
  dragleft: function () {},
  dragright: function () {},
  swiftup: function () {},
  swiftdown: function () {},
  swiftleft: function () {},
  swiftright: function () {}
}
