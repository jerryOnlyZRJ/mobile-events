'use strict';

const events = require('./events.js');
const delegateProxyCreator = require('./proxy.js');
const weakMapCreator = require('./weakmap.js');

/**
 * MTEvents类
 * 库内所有不对外发布的方法都以私有变量格式命名
 */
class MTEvents {
  constructor () {
    this.userCallback2Handler = new Map();
  }
  /**
   * mtEvents 绑定事件方法
   * @param  {String(Selector) | HTMLElement}   bindTarget              事件绑定DOM对象
   * @param  {String(Selector)}              delegateTarget                           代理对象
   * @param {String}                        event                                                  待绑定事件
   * @param  {Function}                       callback                                           事件回调
   * @return {HTMLElement}                  bindTarget                             事件绑定DOM对象
   * @example
   * mtEvents('#bindtarget', '#delegateTarget', 'longtap', (e) => {
   *   //do somthing
   * })
   * @example
   * 开始处理用户传入参数
   * bind(node, {event: handler})
   * @example
   * bind(node, selector, {event: handler})
   * @example
   * bind(node, 'longtap', [callback1, callback2])
   * @example
   * bind('#bindTarget', 'click', handler)
   * @example
   * 函数参数处理完毕
   * bind('#bindTarget', ...args)
   * @example
   * bind('#bindTarget', '#delegateTarget', 'click', handler)
   * @example
   * bind('#bindTarget', '#delegateTarget', 'longtap', handler)
   */
  bind (bindTarget, delegateTarget, event, callback) {
    // TODOS: Check arguments validity
    // arrange user input
    if (typeof delegateTarget === 'object') {
      this._handleEventObj(delegateTarget, (event, handler) =>
        this.bind(bindTarget, undefined, event, handler)
      );
      return bindTarget
    } else if (!(event instanceof Array) && typeof event === 'object') {
      this._handleEventObj(event, (event, handler) =>
        this.bind(bindTarget, delegateTarget, event, handler)
      );
      return bindTarget
    } else if (typeof event === 'function' || event instanceof Array) {
      return this.bind(bindTarget, undefined, delegateTarget, event)
    }
    bindTarget = this._checkBindTargetInput(bindTarget);
    const eventHandler = e => {
      delegateProxyCreator(bindTarget, delegateTarget, e, () => {
        callback(e);
      })();
    };
    this.userCallback2Handler.set(callback, eventHandler);
    if (!this._isEventDIY(event)) {
      const weakmap = weakMapCreator(bindTarget, eventHandler);
      bindTarget.addEventListener(event, weakmap.get(bindTarget));
    } else {
      events[event].bind(bindTarget, callback, delegateTarget);
    }
    return bindTarget
  }
  /**
   * remove 移除事件函数
   * @param  {String(Selector) | HTMLElement}   bindTarget              事件绑定DOM对象
   * @param {String}                              event                                            绑定事件名称
   * @return {HTMLElement} [description]
   * @example
   * const handler = () => console.log('handler')
   * bind('#bindTarget', 'click', handler)
   * remove('#bindTarget', 'click', handler)
   */
  remove (bindTarget, event, callback) {
    bindTarget = this._checkBindTargetInput(bindTarget);
    if (typeof event === 'object') {
      this._handleEventObj(event, (event, handler) => {
        this.remove(bindTarget, event, handler);
      });
    }
    if (!this._isEventDIY(event)) {
      bindTarget.removeEventListener(
        event,
        this.userCallback2Handler.get(callback)
      );
    } else {
      events[event].remove(bindTarget, callback);
    }
    return bindTarget
  }
  /**
   * _handleEventObj    遍历用户输入事件对象执行回调
   * @param  {Object}       eventObj       事件对象
   * @return {Array}    []
   */
  _handleEventObj (eventObj, callback) {
    return Object.entries(eventObj).map(eventItem => {
      callback(eventItem[0], eventItem[1]);
    })
  }
  /**
   * _checkBindTargetInput 检测用户输入的bindTarget是否合法
   * @param  {String(Selector) | HTMLElement}      bindTarget     待绑定元素
   * @return {HTMLElement}            待绑定元素
   */
  _checkBindTargetInput (bindTarget) {
    if (typeof bindTarget === 'string') {
      bindTarget = document.querySelector(bindTarget);
      if (!bindTarget) {
        throw new Error(
          'None of DOM had been choisen, Please input a correct selector or a HTMLElement'
        )
      }
    }
    return bindTarget
  }
  /**
   * _isEventDIY 判断用户输入事件是否为自定义事件
   * @param  {String}  event 事件名称
   * @return {Boolean}       是否为自定义事件
   */
  _isEventDIY (event) {
    const _events = new Set(Object.keys(events));
    return _events.has(event)
  }
}

let mtEvents = new MTEvents();
const mtEventsPrototype = Object.create(MTEvents.prototype);
const mtEventsFun = mtEvents.bind.bind(mtEvents);
Object.setPrototypeOf(mtEventsFun, mtEventsPrototype);
Object.keys(mtEvents).map(keyItem => {
  mtEventsFun[keyItem] = mtEvents[keyItem];
});

{
  window.mtEvents = mtEventsFun;
}
