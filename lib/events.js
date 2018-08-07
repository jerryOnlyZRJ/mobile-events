const delegateProxyCreator = require('./proxy.js')
/**
 * 自定义事件处理句柄生成器
 * 每个自定义事件处理句柄以自定义事件命名
 * 所有处理句柄可传入三个参数：
 * ①bindTarget：事件绑定对象
 * ②callback：事件处理回调(必须向callback传入原生事件对象e)
 * ③delegateTarget：事件代理对象
 */
class Events {
  constructor() {
    /**
     * longtap 自定义长按事件
     */
    this.longtap = {
      eventHandler: new Map(),
      bind: (bindTarget, callback, delegateTarget) => {
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
        let longTapCallback = callback
        let shortTapCallback = null
        let timer = null
        if (typeof callback === 'object') {
          longTapCallback = callback[0]
          shortTapCallback = callback[1]
        }
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
        this._removeEvent('longtap', bindTarget, callback)
      }
    }
    /**
     * dbtap 自定义双击事件
     */
    this.dbtap = {
      eventHandler: new Map(),
      bind: (bindTarget, callback, delegateTarget) => {
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
        const xrange = 100
        const yrange = 100
        let timer = null
        let lastClientX
        let lastClientY
        bindTarget.addEventListener(
          'touchend',
          this.dbtap.eventHandler.get(callback).touchend
        )
      },
      remove: (bindTarget, callback) => {
        this._removeEvent('dbtap', bindTarget, callback)
      }
    }
  }
  _removeEvent(type, bindTarget, callback) {
    Object.entries(this[type].eventHandler.get(callback)).map(eventItem => {
      bindTarget.removeEventListener(eventItem[0], eventItem[1])
    })
  }
}

module.exports = new Events()