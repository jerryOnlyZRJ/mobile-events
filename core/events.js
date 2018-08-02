class Events {
  _delegateEvent (bindTarget, delegateTarget, target) {
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
  longtap (bindTarget, callback, delegateTarget) {
    let longTapCallback = callback
    let shortTapCallback = null
    let timer = null
    if (typeof callback === 'object') {
      longTapCallback = callback[0]
      shortTapCallback = callback[1]
    }
    bindTarget.addEventListener(
      'touchstart',
      e => {
        const target = this._delegateEvent(
          bindTarget,
          delegateTarget,
          e.target
        )
        if ((delegateTarget && target) || !delegateTarget) {
          timer = setTimeout(() => {
            clearTimeout(timer)
            timer = null
          }, 500)
        } else {
        }
      },
      false
    )
    bindTarget.addEventListener(
      'touchend',
      e => {
        const target = this._delegateEvent(
          bindTarget,
          delegateTarget,
          e.target
        )
        if ((delegateTarget && target) || !delegateTarget) {
          if (timer) {
            longTapCallback(e)
          } else {
            shortTapCallback && shortTapCallback(e)
          }
          clearTimeout(timer)
          timer = null
        } else {
        }
      },
      false
    )
  }
  dbtap (bindTarget, callback, delegateTarget) {
    const xrange = 100
    const yrange = 100
    let timer = null
    let lastClientX
    let lastClientY
    bindTarget.addEventListener('touchend', e => {
      const target = this._delegateEvent(bindTarget, delegateTarget, e.target)
      if ((delegateTarget && target) || !delegateTarget) {
        if (timer) {
          clearTimeout(timer)
          timer = null
          const thisClientX = e.changedTouches[0].clientX
          const thisClientY = e.changedTouches[0].clientY
          const x = Math.abs(thisClientX - lastClientX)
          const y = Math.abs(thisClientY - lastClientY)
          if (x <= xrange && y <= yrange) {
            callback(e)
          } else {
            lastClientX = e.changedTouches[0].clientX
            lastClientY = e.changedTouches[0].clientY
            timer = setTimeout(() => {
              lastClientX = null
              lastClientY = null
              clearTimeout(timer)
              timer = null
            }, 500)
          }
        }
      }
    })
  }
  dragup () {}
  dragdown () {}
  dragleft () {}
  dragright () {}
  swiftup () {}
  swiftdown () {}
  swiftleft () {}
  swiftright () {}
}

module.exports = new Events()
