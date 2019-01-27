/**
 * weakMapBinder WeakMap事件绑定器
 * @param  {HTMLElement}   htmlElement DOM元素
 * @param  {Function} callback    事件监听回调
 * @return {WeakMap}               WeakMap实例
 */
function weakMapBinder (htmlElement, callback, event) {
  let weakMap = new WeakMap()
  weakMap.set(htmlElement, callback)
  htmlElement.addEventListener(event, weakMap.get(htmlElement))
}

export default weakMapBinder
