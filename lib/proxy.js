/**
 * _delegateEvent 事件代理处理
 * @param  {String(Selector) | HTMLDivElement} bindTarget     事件绑定元素
 * @param  {String(Selector)} delegateTarget 事件代理元素
 * @param  {Object} target         原生事件对象上的target对象，即(e.target)
 * @return {Object | null}             如果存在代理，则调用此方法，事件发生在代理对象上则返回代理对象
 */
function _delegateEvent (bindTarget, delegateTarget, target) {
  if (!delegateTarget) return null
  const delegateTargets = new Set(document.querySelectorAll(delegateTarget))
  while (target !== bindTarget) {
    if (delegateTargets.has(target)) {
      return target
    } else {
      target = target.parentNode
    }
  }
  return null
}

/**
 * delegateProxyCreator 事件代理Proxy生成器
 * @param  {String(Selector) | HTMLDivElement} bindTarget     事件绑定元素
 * @param  {String(Selector)} delegateTarget 事件代理元素
 * @param  {Object} target            原生事件对象
 * @param  {Function} callback       proxy拦截回调
 * @return {Function}                  过Proxy的callback
 */
function delegateProxyCreator (bindTarget, delegateTarget, e, callback) {
  const handler = {
    apply (callback, ctx, args) {
      const target = _delegateEvent(bindTarget, delegateTarget, e.target)
      if ((delegateTarget && target) || !delegateTarget) {
        return Reflect.apply(...arguments)
      }
    }
  }
  return new Proxy(callback, handler)
}

module.exports = delegateProxyCreator
