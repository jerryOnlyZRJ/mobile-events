/**
 * weakMapCreator WeakMap生成器
 * @param  {HTMLElement}   htmlElement DOM元素
 * @param  {Function} callback    事件监听回调
 * @return {WeakMap}               WeakMap实例
 */
function weakMapCreator (htmlElement, callback) {
  let weakMap = new WeakMap()
  weakMap.set(htmlElement, callback)
  return weakMap
}

module.exports = weakMapCreator
