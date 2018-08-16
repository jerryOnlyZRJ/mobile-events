const delegateProxyCreator = require('./tools/proxy.js')
const SingleEvent = require('./tools/singleevent.js')
const Timer = require('./tools/timer.js')
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
        let timer = new Timer()
        let lastClientX
        let lastClientY
        return {
          touchstart: e => {
            e.preventDefault()
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              lastClientX = e.changedTouches[0].clientX
              lastClientY = e.changedTouches[0].clientY
              timer.timeoutCreator(300, () => {
                lastClientX = null
                lastClientY = null
              })
            })()
          },
          touchend: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (timer.timer) {
                const thisClientX = e.changedTouches[0].clientX
                const thisClientY = e.changedTouches[0].clientY
                const x = Math.abs(thisClientX - lastClientX)
                const y = Math.abs(thisClientY - lastClientY)
                if (x <= 50 && y <= 50) {
                  e.preventDefault()
                  callback(e)
                }
              }
              timer.clearTimer()
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
        let timer = new Timer()
        if (typeof callback === 'object') {
          longTapCallback = callback[0]
          shortTapCallback = callback[1]
        }
        return {
          touchstart: e => {
            e.preventDefault()
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              timer.timeoutCreator(1000)
            })()
          },
          touchend: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (timer.timer) {
                shortTapCallback && shortTapCallback(e)
              } else {
                longTapCallback(e)
              }
              timer.clearTimer()
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
        let timer = new Timer()
        let lastClientX
        let lastClientY
        return {
          touchend: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (timer.timer) {
                timer.clearTimer()
                const thisClientX = e.changedTouches[0].clientX
                const thisClientY = e.changedTouches[0].clientY
                const x = Math.abs(thisClientX - lastClientX)
                const y = Math.abs(thisClientY - lastClientY)
                if (x <= 100 && y <= 100) {
                  e.preventDefault()
                  callback(e)
                } else {
                  console.log('Double click in different area!')
                }
              } else {
                lastClientX = e.changedTouches[0].clientX
                lastClientY = e.changedTouches[0].clientY
                timer.timeoutCreator(500, () => {
                  lastClientX = null
                  lastClientY = null
                })
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
