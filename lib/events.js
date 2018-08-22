const SingleEvent = require('./tools/singleevent.js')
const Timer = require('./tools/timer.js')
const Position = require('./tools/position.js')

function getVectorLength (x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
}
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
      eventHandlers: function (callback) {
        let timer = new Timer()
        let position = new Position()
        return {
          touchstart: e => {
            e.preventDefault()
            position.initClientPos(e)
            timer.timeoutCreator(300, () => {
              position.resetClientPos()
            })
          },
          touchend: e => {
            if (timer.timer) {
              if (position.isWithinDistance(e, 50, 50)) {
                e.preventDefault()
                callback(e)
              }
            }
            timer.clearTimer()
          }
        }
      }
    })
    /**
     * longtap 自定义长按事件
     */
    this.longtap = new SingleEvent({
      eventHandlers: function (callback) {
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
            timer.timeoutCreator(1000)
          },
          touchend: e => {
            if (timer.timer) {
              shortTapCallback && shortTapCallback(e)
            } else {
              longTapCallback(e)
            }
            timer.clearTimer()
          }
        }
      }
    })
    /**
     * dbtap 自定义双击事件
     */
    this.dbtap = new SingleEvent({
      eventHandlers: function (callback) {
        let timer = new Timer()
        let position = new Position()
        return {
          touchend: e => {
            if (timer.timer) {
              timer.clearTimer()
              if (position.isWithinDistance(e, 100, 100)) {
                e.preventDefault()
                callback(e)
              } else {
                console.log('Double click in different area!')
              }
            } else {
              position.initClientPos(e)
              timer.timeoutCreator(500, () => {
                position.resetClientPos()
              })
            }
          }
        }
      }
    })
    this.drag = new SingleEvent({
      eventHandlers: function (callback) {
        let lastClientObj = null
        return {
          touchstart: e => {
            lastClientObj = {
              lastClientX: e.changedTouches[0].clientX,
              lastClientY: e.changedTouches[0].clientY
            }
          },
          touchend: e => {
            if (callback instanceof Array) {
              return _arrangeCallbackArr(e, callback, lastClientObj)
            }
            callback(e)
          }
        }
      }
    })
    this.swift = new SingleEvent({
      eventHandlers: function (callback) {
        let lastClientObj = null
        return {
          touchmove: e => {
            e.preventDefault()
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
          }
        }
      }
    })
    this.scale = new SingleEvent({
      eventHandlers: function (callback) {
        let lastSpaceOf2Touch = 0
        let timer = new Timer()
        return {
          touchmove: e => {
            e.preventDefault()
            if (e.touches.length === 2) {
              if (!lastSpaceOf2Touch) {
                lastSpaceOf2Touch = getVectorLength(
                  e.touches[0].clientX,
                  e.touches[0].clientY,
                  e.touches[1].clientX,
                  e.touches[1].clientY
                )
              } else if (!timer.timer) {
                timer.timeoutCreator(50, () => {
                  if (!lastSpaceOf2Touch) return
                  const thisSpaceOf2Touch = getVectorLength(
                    e.touches[0].clientX,
                    e.touches[0].clientY,
                    e.touches[1].clientX,
                    e.touches[1].clientY
                  )
                  // matrix(0.75, 0, 0, 0.75, 0, 0)
                  const scale =
                    Math.floor((thisSpaceOf2Touch * 100) / lastSpaceOf2Touch) /
                    100
                  e.scale = scale
                  callback(e)
                })
              }
            }
          },
          touchend: e => {
            lastSpaceOf2Touch = 0
          }
        }
      }
    })
    this.rotate = new SingleEvent({
      eventHandlers: function (callback) {
        let lastArrOf2Touch = null
        let timer = new Timer()
        return {
          touchmove: e => {
            if (e.touches.length === 2) {
              if (!lastArrOf2Touch) {
                lastArrOf2Touch = Object.assign([], e.touches)
              } else if (!timer.timer) {
                timer.timeoutCreator(50, () => {
                  if (!lastArrOf2Touch) return
                  const lastX1 = lastArrOf2Touch[0].clientX
                  const lastX2 = lastArrOf2Touch[1].clientX
                  const thisX1 = e.touches[0].clientX
                  const thisX2 = e.touches[1].clientX
                  const lastY1 = lastArrOf2Touch[0].clientY
                  const lastY2 = lastArrOf2Touch[1].clientY
                  const thisY1 = e.touches[0].clientY
                  const thisY2 = e.touches[1].clientY
                  const lengthOfLast = getVectorLength(
                    lastX1,
                    lastY1,
                    lastX2,
                    lastY2
                  )
                  const lengthOfThis = getVectorLength(
                    thisX1,
                    thisY1,
                    thisX2,
                    thisY2
                  )
                  const rotateAngle =
                    (Math.acos(
                      ((lastX2 - lastX1) * (thisX2 - thisX1) +
                        (lastY2 - lastY1) * (thisY2 - thisY1)) /
                        (lengthOfLast * lengthOfThis)
                    ) *
                      180) /
                    Math.PI
                  // 顺时针+， 逆时针-
                  const vectorCross =
                    (lastX2 - lastX1) * (thisY2 - thisY1) -
                    (thisX2 - thisX1) * (lastY2 - lastY1)
                  let rotate = {
                    rotateAngle
                  }
                  if (vectorCross < 0) {
                    rotate.direction = 'anticlockwise'
                    rotate.dirt = 0
                  } else if (vectorCross > 0) {
                    rotate.direction = 'clockwise'
                    rotate.dirt = 1
                  }
                  e.rotate = rotate
                  callback(e)
                })
              }
            }
          },
          touchend: e => {
            lastArrOf2Touch = null
          }
        }
      }
    })
  }
}

module.exports = new Events()
