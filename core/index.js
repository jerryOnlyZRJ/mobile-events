const events = require('./events.js')

class MEvents {
  /**
   * mEvents 绑定事件
   * @param  {String(Selector) || HTMLDivElement}   bindTarget          事件绑定DOM对象
   * @param  {String(Selector)}   delegateTarget                                    代理对象
   * @param {String}      event                                                                 待绑定事件
   * @param  {Function} callback                                                               事件回调
   * @param  {Object}   data                                                                    传入Handler的数据
   * @param  {Object}   options                                                                配置参数
   * {
   *   isPreventDefault: Boolean,
   *   isStopPropagation: Boolean
   * }
   * @return {HTMLDivElement}                  bindTarget                         事件绑定DOM对象
   */
  mEvents (bindTarget, delegateTarget, event, callback, data, options = {
    isPreventDefault: false,
    isStopPropagation: false
  }) {
    // arrange user input
    if (typeof delegateTarget === 'object') {
      // mEvents(node, {event: {handler, data, options}})
      return this._handleEventObj(bindTarget, undefined, delegateTarget)
    } else if (typeof event === 'object') {
      // mEvents(node, selector, {event: {handler, data, options}})
      return this._handleEventObj(bindTarget, delegateTarget, event)
    }
    const _events = new Set(Object.keys(events))
    if (typeof bindTarget === 'string') {
      bindTarget = document.querySelector(bindTarget)
    }
    if (!_events.has(event)) {

    }
    events[event](callback, options)
  }

  _delegateEvent (bindTarget, delegateTarget, event, callback) {
    if (delegateTarget) {
      const delegateTargets = new Set(document.querySelectorAll(delegateTarget))
      bindTarget.addEventListener(event, (e) => {
        let target = e.target
        while (target !== bindTarget) {
          if (delegateTargets.has(target)) {
            callback(e)
          } else {
            target = target.parentNode
          }
        }
      })
    } else {
      bindTarget.addEventListener(event, e => {

      })
    }
    return bindTarget
  }

  _handleEventObj (bindTarget, delegateTarget, eventObj) {
    Object.entries(eventObj).map(bindTargetItem => {
      if (typeof bindTargetItem[1] === 'function') {
        this.mEvents(bindTarget, delegateTarget, bindTargetItem[0], bindTargetItem[1])
      } else {
        this.mEvents(bindTarget, delegateTarget, bindTargetItem[0], bindTargetItem[1].handler, bindTargetItem[1].data, bindTargetItem[1].options)
      }
    })
    return bindTarget
  }
  /**
   * getElement 通过选择器获取单个元素
   * @param  {String} selector H5标准选择器
   * @return {HTMLDivElement}         选择器捕获的DOM元素
   */
  getElement (selector) {
    return document.querySelector(selector)
  }
  /**
   * getElement 通过选择器获取多个元素
   * @param  {String} selector H5标准选择器
   * @return {NodeList}          HTMLDivElement 类数组
   */
  getElements (selector) {
    return document.querySelectorAll(selector)
  }
}

module.exports = MEvents
