const delegateProxyCreator = require('./proxy.js')
const SingleEvent = require('./singleevent.js')
/**
 * _arrangeCallbackArr 处理用户传入回调数组
 * @param  {Object} e             原生事件对象
 * @param  {Array} callbackArr   回调数组
 * @param  {Object} lastClientObj 上一次的事件位置信息
 */
function _arrangeCallbackArr (e, callbackArr, lastClientObj) {
  const { lastClientX, lastClientY } = lastClientObj
  const clientX = e.changedTouches[0].clientX
  const clientY = e.changedTouches[0].clientY
  let left, right, up, down
  switch (callbackArr.length) {
    case 1:
      up = right = down = left = callbackArr[0]
      break
    case 2:
      up = down = callbackArr[0]
      right = left = callbackArr[1]
      break
    case 3:
      up = callbackArr[0]
      right = left = callbackArr[1]
      down = callbackArr[2]
      break
    case 4:
      up = callbackArr[0]
      right = callbackArr[1]
      down = callbackArr[2]
      left = callbackArr[3]
  }
  if (clientX > lastClientX) {
    right(e)
  } else {
    left(e)
  }
  if (clientY > lastClientY) {
    down(e)
  } else {
    up(e)
  }
  lastClientObj.lastClientX = clientX
  lastClientObj.lastClientY = clientY
}
/**
 * 自定义事件处理句柄生成器
 * 每个自定义事件处理句柄以自定义事件命名
 * 所有处理句柄可传入三个参数：
 * ①bindTarget：事件绑定对象
 * ②callback： 事件处理回调(必须向callback传入原生事件对象e)
 * ③delegateTarget：事件代理对象
 */
class Events {
  constructor () {
    /**
     * tap 自定义点击事件
     */
    this.tap = new SingleEvent({
      eventHandlers: function (bindTarget, callback, delegateTarget) {
        const xrange = 50
        const yrange = 50
        let timer = null
        let lastClientX
        let lastClientY
        return {
          touchstart: e => {
            e.preventDefault()
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              lastClientX = e.changedTouches[0].clientX
              lastClientY = e.changedTouches[0].clientY
              timer = setTimeout(() => {
                lastClientX = null
                lastClientY = null
                clearTimeout(timer)
                timer = null
              }, 300)
            })()
          },
          touchend: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (timer) {
                const thisClientX = e.changedTouches[0].clientX
                const thisClientY = e.changedTouches[0].clientY
                const x = Math.abs(thisClientX - lastClientX)
                const y = Math.abs(thisClientY - lastClientY)
                if (x <= xrange && y <= yrange) {
                  e.preventDefault()
                  callback(e)
                }
              }
              clearTimeout(timer)
              timer = null
            })()
          }
        }
      }
    })
    /**
     * longtap 自定义长按事件
     */
    this.longtap = new SingleEvent({
      eventHandlers: function (bindTarget, callback, delegateTarget) {
        let longTapCallback = callback
        let shortTapCallback = null
        let timer = null
        if (typeof callback === 'object') {
          longTapCallback = callback[0]
          shortTapCallback = callback[1]
        }
        return {
          touchstart: e => {
            e.preventDefault()
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              timer = setTimeout(() => {
                clearTimeout(timer)
                timer = null
              }, 1000)
            })()
          },
          touchend: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (timer) {
                shortTapCallback && shortTapCallback(e)
              } else {
                longTapCallback(e)
              }
              clearTimeout(timer)
              timer = null
            })()
          }
        }
      }
    })
    /**
     * dbtap 自定义双击事件
     */
    this.dbtap = new SingleEvent({
      eventHandlers: function (bindTarget, callback, delegateTarget) {
        const xrange = 100
        const yrange = 100
        let timer = null
        let lastClientX
        let lastClientY
        return {
          touchend: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (timer) {
                clearTimeout(timer)
                timer = null
                const thisClientX = e.changedTouches[0].clientX
                const thisClientY = e.changedTouches[0].clientY
                const x = Math.abs(thisClientX - lastClientX)
                const y = Math.abs(thisClientY - lastClientY)
                if (x <= xrange && y <= yrange) {
                  e.preventDefault()
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
                  timer && clearTimeout(timer)
                  timer = null
                }, 500)
              }
            })()
          }
        }
      }
    })
    this.drag = new SingleEvent({
      eventHandlers: function (bindTarget, callback, delegateTarget) {
        let lastClientObj = null
        return {
          touchstart: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              lastClientObj = {
                lastClientX: e.changedTouches[0].clientX,
                lastClientY: e.changedTouches[0].clientY
              }
            })()
          },
          touchend: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (callback instanceof Array) {
                return _arrangeCallbackArr(e, callback, lastClientObj)
              }
              callback(e)
            })()
          }
        }
      }
    })
    this.swift = new SingleEvent({
      eventHandlers: function (bindTarget, callback, delegateTarget) {
        let lastClientObj = null
        return {
          touchmove: e => {
            e.preventDefault()
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (!lastClientObj) {
                lastClientObj = {
                  lastClientX: e.changedTouches[0].clientX,
                  lastClientY: e.changedTouches[0].clientY
                }
              }
              if (callback instanceof Array) {
                return _arrangeCallbackArr(e, callback, lastClientObj)
              }
              callback(e)
            })()
          }
        }
      }
    })
  }
}

module.exports = new Events()
