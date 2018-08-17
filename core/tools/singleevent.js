const weakMapBinder = require('./weakmap.js')
const delegateProxyCreator = require('./proxy.js')

class SingleEvent {
  constructor(options) {
    this.eventHandler = new Map()
    this.options = options
  }
  bind(bindTarget, callback, delegateTarget) {
    // callback = delegateProxyCreator(bindTarget, delegateTarget, callback)
    let eventHandlers = this.options.eventHandlers(
      bindTarget,
      callback,
      delegateTarget
    )
    Object.keys(eventHandlers).map(item => {
      eventHandlers[item] = delegateProxyCreator(bindTarget, delegateTarget, eventHandlers[item])
    })
    this.eventHandler.set(callback, eventHandlers)
    Object.keys(eventHandlers).map(item => { //touchstart
      weakMapBinder(bindTarget, eventHandlers[item], item)
    })
  }
  remove(bindTarget, callback) {
    Object.entries(this.eventHandler.get(callback)).map(eventItem => {
      bindTarget.removeEventListener(eventItem[0], eventItem[1])
    })
    return bindTarget
  }
}

module.exports = SingleEvent