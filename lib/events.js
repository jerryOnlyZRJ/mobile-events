const delegateProxyCreator = require('./proxy.js')
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
     * longtap 自定义长按事件
     */
    this.longtap = {
      eventHandler: new Map(),
      bind: (bindTarget, callback, delegateTarget) => {
        let longTapCallback = callback
        let shortTapCallback = null
        let timer = null
        if (typeof callback === 'object') {
          longTapCallback = callback[0]
          shortTapCallback = callback[1]
        }
        this.longtap.eventHandler.set(callback, {
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
        })
        bindTarget.addEventListener(
          'touchstart',
          this.longtap.eventHandler.get(callback).touchstart
        )
        bindTarget.addEventListener(
          'touchend',
          this.longtap.eventHandler.get(callback).touchend
        )
      },
      remove: (bindTarget, callback) => {
        return this._removeEvent('longtap', bindTarget, callback)
      }
    }
    /**
     * dbtap 自定义双击事件
     */
    this.dbtap = {
      eventHandler: new Map(),
      bind: (bindTarget, callback, delegateTarget) => {
        const xrange = 100
        const yrange = 100
        let timer = null
        let lastClientX
        let lastClientY
        this.dbtap.eventHandler.set(callback, {
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
        })
        bindTarget.addEventListener(
          'touchend',
          this.dbtap.eventHandler.get(callback).touchend
        )
      },
      remove: (bindTarget, callback) => {
        return this._removeEvent('dbtap', bindTarget, callback)
      }
    }
    this.drag = {
      eventHandler: new Map(),
      bind: (bindTarget, callback, delegateTarget) => {
        this.drag.eventHandler.set(callback, {
          touchstart: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              this.drag.lastClientObj = {
                lastClientX: e.changedTouches[0].clientX,
                lastClientY: e.changedTouches[0].clientY
              }
            })()
          },
          touchend: e => {
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (callback instanceof Array) {
                return this._arrangeCallbackArr(
                  e,
                  callback,
                  this.drag.lastClientObj
                )
              }
              callback(e)
            })()
          }
        })
        bindTarget.addEventListener(
          'touchstart',
          this.drag.eventHandler.get(callback).touchstart
        )
        bindTarget.addEventListener(
          'touchend',
          this.drag.eventHandler.get(callback).touchend
        )
      },
      remove: (bindTarget, callback) => {
        return this._removeEvent('drag', bindTarget, callback)
      }
    }
    this.swift = {
      eventHandler: new Map(),
      bind: (bindTarget, callback, delegateTarget) => {
        this.swift.eventHandler.set(callback, {
          touchmove: e => {
            e.preventDefault()
            delegateProxyCreator(bindTarget, delegateTarget, e, () => {
              if (!this.swift.lastClientObj) {
                this.swift.lastClientObj = {
                  lastClientX: e.changedTouches[0].clientX,
                  lastClientY: e.changedTouches[0].clientY
                }
              }
              if (callback instanceof Array) {
                return this._arrangeCallbackArr(
                  e,
                  callback,
                  this.swift.lastClientObj
                )
              }
              callback(e)
            })()
          }
        })
        bindTarget.addEventListener(
          'touchmove',
          this.swift.eventHandler.get(callback).touchmove
        )
      },
      remove: (bindTarget, callback) => {
        return this._removeEvent('swift', bindTarget, callback)
      }
    }
  }
  /**
   * _removeEvent 自定义事件移除
   * @param  {String}   type       自定义事件名称
   * @param  {HTMLElement}   bindTarget [description]
   * @param  {Function} callback          用户自定义回调
   * @return {HTMLElement}              [description]
   */
  _removeEvent (type, bindTarget, callback) {
    Object.entries(this[type].eventHandler.get(callback)).map(eventItem => {
      bindTarget.removeEventListener(eventItem[0], eventItem[1])
    })
    return bindTarget
  }
  /**
   * _arrangeCallbackArr 处理用户传入回调数组
   * @param  {Object} e             原生事件对象
   * @param  {Array} callbackArr   回调数组
   * @param  {Object} lastClientObj 上一次的事件位置信息
   */
  _arrangeCallbackArr (e, callbackArr, lastClientObj) {
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
}

module.exports = new Events()
