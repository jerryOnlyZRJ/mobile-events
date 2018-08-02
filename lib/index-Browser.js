'use strict';

const events = require('./events.js');

/**
 * MTEvents类
 * 库内所有不对外发布的方法都以私有变量格式命名
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
  bind(bindTarget, delegateTarget, event, callback) {
    // arrange user input
    if (typeof delegateTarget === 'object') {
      /**
       * @example
       * bind(node, {event: handler})
       */
      return this._handleEventObj(bindTarget, undefined, delegateTarget)
    } else if (typeof event === 'object') {
      /**
       * @example
       * bind(node, selector, {event: handler})
       */
      return this._handleEventObj(bindTarget, delegateTarget, event)
    }
    /**
     * @example
     * bind('#bindTarget', ...args)
     */
    if (typeof bindTarget === 'string') {
      bindTarget = document.querySelector(bindTarget);
    }
    const _events = new Set(Object.keys(events));
    if (!_events.has(event)) {
      /**
       * @example
       * bind('#bindTarget', '#delegateTarget', 'click', handler)
       */
      bindTarget.addEventListener(event, e => {
        const target = events._delegateEvent(
          bindTarget,
          delegateTarget,
          e.target
        );
        if ((delegateTarget && target) || !delegateTarget) {
          callback(e);
        }
      });
    }
    /**
     * @example
     * bind('#bindTarget', '#delegateTarget', 'longtap', handler)
     */
    events[event](bindTarget, callback, delegateTarget);
    return bindTarget
  }
  /**
   * _handleEventObj    整理用户输入事件句柄对象
   * @param  {String(Selector) | HTMLDivElement}      bindTarget     待绑定元素
   * @param  {String(Selector)}           delegateTarget 代理元素选择器
   * @param  {Object}       eventObj       事件句柄对象
   * @return {HTMLDivElement}    bindTarget     事件绑定DOM对象
   */
  _handleEventObj(bindTarget, delegateTarget, eventObj) {
    Object.entries(eventObj).map(bindTargetItem => {
      this.mtEvents(
        bindTarget,
        delegateTarget,
        bindTargetItem[0],
        bindTargetItem[1]
      );
    });
    return bindTarget
  }
}

let mtEvents = new MTEvents();
const mtEventsPrototype = Object.create(MTEvents.prototype);
mtEvents = mtEvents.bind;
Object.setPrototypeOf(mtEvents, mtEventsPrototype);

{
  window.mtEvents = mtEvents;
}
