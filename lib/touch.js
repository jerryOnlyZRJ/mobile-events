/**
 * Touch事件类
 * 用于测试touch系列事件
 */
class Touch {
  /**
   * _createTouchEvent 支持浏览器调用touch系列事件，初始化事件
   * @param  {String}     type 事件名称(touchend)
   * @return {Object}      浏览器原生事件对象
   */
  createTouchEvent (type) {
    return new window.Event(type, {
      bubbles: true,
      cancelable: true
    })
  }
  /**
   * _dispatchTouchEvent 出发touch系列事件
   * @param  {String(Selector) | HTMLDivElement} eventTarget 事件触发DOM元素
   * @param  {Object} event       浏览器原生事件对象
   * @return {HTMLDivElement}             事件触发DOM元素
   */
  dispatchTouchEvent (eventTarget, event) {
    if (typeof eventTarget === 'string') {
      eventTarget = document.querySelector(eventTarget)
    }
    eventTarget.dispatchEvent(event)
    return eventTarget
  }
}

module.exports = new Touch()
