class SingleEvent {
  constructor (options) {
    this.eventHandler = new Map()
    this.options = options
  }
  bind (bindTarget, callback, delegateTarget) {
    const eventHandlers = this.options.eventHandlers(
      bindTarget,
      callback,
      delegateTarget
    )
    this.eventHandler.set(callback, eventHandlers)
    Object.keys(eventHandlers).map(item => {
      bindTarget.addEventListener(item, eventHandlers[item])
    })
  }
  remove (bindTarget, callback) {
    Object.entries(this.eventHandler.get(callback)).map(eventItem => {
      bindTarget.removeEventListener(eventItem[0], eventItem[1])
    })
    return bindTarget
  }
}

module.exports = SingleEvent
