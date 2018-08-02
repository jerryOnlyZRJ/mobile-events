const events = require('./events.js')

/**
 * MTEvents类
 */
class MTEvents {
  /**
   * mtEvents 绑定事件方法
   * @param  {String(Selector) | HTMLDivElement}   bindTarget              事件绑定DOM对象
   * @param  {String(Selector)}              delegateTarget                           代理对象
   * @param {String}                        event                                                  待绑定事件
   * @param  {Function}                       callback                                           事件回调
   * @return {HTMLDivElement}                  bindTarget                             事件绑定DOM对象
   * @example
   * mtEvents('#bindtarget', '#delegateTarget', 'longtap', (e) => {
   *   //do somthing
   * })
   */
  mtEvents (bindTarget, delegateTarget, event, callback) {
    // arrange user input
    if (typeof delegateTarget === 'object') {
      // mtEvents(node, {event: handler})
      return this._handleEventObj(bindTarget, undefined, delegateTarget)
    } else if (typeof event === 'object') {
      // mtEvents(node, selector, {event: handler})
      return this._handleEventObj(bindTarget, delegateTarget, event)
    }
    const _events = new Set(Object.keys(events))
    if (typeof bindTarget === 'string') {
      bindTarget = document.querySelector(bindTarget)
    }
    if (!_events.has(event)) {
      bindTarget.addEventListener(event, e => {
        const target = events._delegateEvent(
          bindTarget,
          delegateTarget,
          e.target
        )
        if ((delegateTarget && target) || !delegateTarget) {
          callback(e)
        }
      })
    }
    events[event](bindTarget, callback, delegateTarget)
    return bindTarget
  }

  _handleEventObj (bindTarget, delegateTarget, eventObj) {
    Object.entries(eventObj).map(bindTargetItem => {
      this.mtEvents(
        bindTarget,
        delegateTarget,
        bindTargetItem[0],
        bindTargetItem[1]
      )
    })
    return bindTarget
  }
}

let mtEvents = new MTEvents()
const mtEventsPrototype = Object.create(MTEvents.prototype)
mtEvents = mtEvents.mtEvents
Object.setPrototypeOf(mtEvents, mtEventsPrototype)

if (process.env.PLATFORM === 'Browser') {
  window.mtEvents = mtEvents
} else {
  module.exports = MTEvents
}
