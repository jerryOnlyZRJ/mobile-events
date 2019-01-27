/**
 * mtEvents v1.2.6
 * Copyright 2018-2019 Ranjay
 * Released under the MIT License
 * https://github.com/jerryOnlyZRJ/mobile-events
 */
/*eslint-disable*/
(function (root, factory) {
  if (typeof module === 'undefined') {
    root.mtEvents = factory()
  } else {
    module.exports = factory()
  }
}(this, function () {
    "use strict";

  
  function _delegateEvent (bindTarget, delegateTarget, target) {
    if (!delegateTarget) { return null }
    var delegateTargets = new Set(document.querySelectorAll(delegateTarget));
    while (target !== bindTarget) {
      if (delegateTargets.has(target)) {
        return target
      } else {
        target = target.parentNode;
      }
    }
    return null
  }

  
  function delegateProxyCreator (bindTarget, delegateTarget, callback) {
    var handler = {
      apply: function apply (callback, ctx, args) {
        var target = _delegateEvent(bindTarget, delegateTarget, args[0].target);
        if ((delegateTarget && target) || !delegateTarget) {
          return Reflect.apply.apply(Reflect, arguments) // 拿到当前上下文内的所有参数
        }
      }
    };
    return new Proxy(callback, handler)
  }

  
  function weakMapBinder (htmlElement, callback, event) {
    var weakMap = new WeakMap();
    weakMap.set(htmlElement, callback);
    htmlElement.addEventListener(event, weakMap.get(htmlElement));
  }

  var SingleEvent = function SingleEvent (options) {
    this.eventHandler = new Map();
    this.options = options;
  };
  SingleEvent.prototype.bind = function bind (bindTarget, callback, delegateTarget) {
    var eventHandlers = this.options.eventHandlers(callback);
    Object.keys(eventHandlers).map(function (item) { // touchstart
      eventHandlers[item] = delegateProxyCreator(bindTarget, delegateTarget, eventHandlers[item]);
      weakMapBinder(bindTarget, eventHandlers[item], item);
    });
    this.eventHandler.set(callback, eventHandlers);
  };
  SingleEvent.prototype.remove = function remove (bindTarget, callback) {
    Object.entries(this.eventHandler.get(callback)).map(function (eventItem) {
      bindTarget.removeEventListener(eventItem[0], eventItem[1]);
    });
    return bindTarget
  };

  var Timer = function Timer () {
    this.timer = null;
  };
  Timer.prototype.timeoutCreator = function timeoutCreator (delay, callback) {
      var this$1 = this;

    this.timer = setTimeout(function () {
      clearTimeout(this$1.timer);
      this$1.timer = null;
      return callback && callback()
    }, delay);
  };
  Timer.prototype.clearTimer = function clearTimer () {
    clearTimeout(this.timer);
    this.timer = null;
  };

  var Position = function Position () {
    this.lastClientObjs = [];
  };
  Position.prototype.initLastClientObjs = function initLastClientObjs (lastClientObjs) {
    this.lastClientObjs = Object.assign([], lastClientObjs);
  };
  Position.prototype.getDisplacement = function getDisplacement (thisClientObjs) {
      var this$1 = this;

    thisClientObjs = Array.from(thisClientObjs);
    return thisClientObjs.map(function (item, index) {
      var ref = this$1.lastClientObjs[index];
        var x = ref.x;
        var y = ref.y;
      return {
        x: item.clientX - x,
        y: item.clientY - y
      }
    })
  };

  function getVectorLength (x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2))
  }

  
  var Events = function Events () {
    
    this.tap = new SingleEvent({
      eventHandlers: function (callback) {
        var timer = new Timer();
        var position = new Position();
        return {
          touchstart: function (e) {
            e.preventDefault();
            position.initLastClientObjs([
              {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
              }
            ]);
            timer.timeoutCreator(200, function () {
              timer.clearTimer();
              position.initLastClientObjs(null);
            });
          },
          touchend: function (e) {
            if (timer.timer) {
              var changeObj = position.getDisplacement(e.changedTouches)[0];
              var x = Math.abs(changeObj.x);
              var y = Math.abs(changeObj.y);
              if (x <= 50 && y <= 50) {
                e.preventDefault();
                callback(e);
              }
            }
            timer.clearTimer();
          }
        }
      }
    });
    
    this.longtap = new SingleEvent({
      eventHandlers: function (callback) {
        var timer = new Timer();
        var position = new Position();
        return {
          touchstart: function (e) {
            e.preventDefault();
            position.initLastClientObjs([
              {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
              }
            ]);
            timer.timeoutCreator(1000);
          },
          touchend: function (e) {
            if (!timer.timer) {
              var changeObj = position.getDisplacement(e.changedTouches)[0];
              var x = Math.abs(changeObj.x);
              var y = Math.abs(changeObj.y);
              if (x <= 100 && y <= 100) {
                e.preventDefault();
                callback(e);
              }
            }
            timer.clearTimer();
          }
        }
      }
    });
    
    this.dbtap = new SingleEvent({
      eventHandlers: function (callback) {
        var timer = new Timer();
        var position = new Position();
        return {
          touchend: function (e) {
            if (timer.timer) {
              timer.clearTimer();
              var changeObj = position.getDisplacement(e.changedTouches)[0];
              var x = Math.abs(changeObj.x);
              var y = Math.abs(changeObj.y);
              if (x <= 100 && y <= 100) {
                e.preventDefault();
                callback(e);
              }
            } else {
              position.initLastClientObjs([
                {
                  x: e.changedTouches[0].clientX,
                  y: e.changedTouches[0].clientY
                }
              ]);
              timer.timeoutCreator(500, function () {
                position.initLastClientObjs(null);
              });
            }
          }
        }
      }
    });
    this.swipe = new SingleEvent({
      eventHandlers: function (callback) {
        var position = new Position();
        return {
          touchstart: function (e) {
            position.initLastClientObjs([
              {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
              }
            ]);
          },
          touchend: function (e) {
            e.displacement = position.getDisplacement(e.changedTouches)[0];
            callback(e);
          }
        }
      }
    });
    this.drag = new SingleEvent({
      eventHandlers: function (callback) {
        var position = new Position();
        return {
          touchstart: function (e) {
            position.initLastClientObjs([
              {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
              }
            ]);
          },
          touchmove: function (e) {
            e.preventDefault();
            e.displacement = position.getDisplacement(e.touches)[0];
            position.initLastClientObjs([
              {
                x: e.touches[0].clientX,
                y: e.touches[0].clientY
              }
            ]);
            callback(e);
          }
        }
      }
    });
    this.scale = new SingleEvent({
      eventHandlers: function (callback) {
        var lastSpaceOf2Touch = 0;
        var timer = new Timer();
        return {
          touchmove: function (e) {
            e.preventDefault();
            if (e.touches.length === 2) {
              if (!lastSpaceOf2Touch) {
                lastSpaceOf2Touch = getVectorLength(
                  e.touches[0].clientX,
                  e.touches[0].clientY,
                  e.touches[1].clientX,
                  e.touches[1].clientY
                );
              } else if (!timer.timer) {
                timer.timeoutCreator(50, function () {
                  if (!lastSpaceOf2Touch) { return }
                  var thisSpaceOf2Touch = getVectorLength(
                    e.touches[0].clientX,
                    e.touches[0].clientY,
                    e.touches[1].clientX,
                    e.touches[1].clientY
                  );
                  // matrix(0.75, 0, 0, 0.75, 0, 0)
                  var scale =
                    Math.floor((thisSpaceOf2Touch * 100) / lastSpaceOf2Touch) /
                    100;
                  e.scale = scale;
                  callback(e);
                });
              }
            }
          },
          touchend: function (e) {
            lastSpaceOf2Touch = 0;
          }
        }
      }
    });
    this.rotate = new SingleEvent({
      eventHandlers: function (callback) {
        var lastArrOf2Touch = null;
        var timer = new Timer();
        return {
          touchmove: function (e) {
            if (e.touches.length === 2) {
              if (!lastArrOf2Touch) {
                lastArrOf2Touch = Object.assign([], e.touches);
              } else if (!timer.timer) {
                timer.timeoutCreator(50, function () {
                  if (!lastArrOf2Touch) { return }
                  var lastX1 = lastArrOf2Touch[0].clientX;
                  var lastX2 = lastArrOf2Touch[1].clientX;
                  var thisX1 = e.touches[0].clientX;
                  var thisX2 = e.touches[1].clientX;
                  var lastY1 = lastArrOf2Touch[0].clientY;
                  var lastY2 = lastArrOf2Touch[1].clientY;
                  var thisY1 = e.touches[0].clientY;
                  var thisY2 = e.touches[1].clientY;
                  var lengthOfLast = getVectorLength(
                    lastX1,
                    lastY1,
                    lastX2,
                    lastY2
                  );
                  var lengthOfThis = getVectorLength(
                    thisX1,
                    thisY1,
                    thisX2,
                    thisY2
                  );
                  var rotateAngle =
                    (Math.acos(
                      ((lastX2 - lastX1) * (thisX2 - thisX1) +
                        (lastY2 - lastY1) * (thisY2 - thisY1)) /
                        (lengthOfLast * lengthOfThis)
                    ) *
                      180) /
                    Math.PI;
                  // 顺时针+， 逆时针-
                  var vectorCross =
                    (lastX2 - lastX1) * (thisY2 - thisY1) -
                    (thisX2 - thisX1) * (lastY2 - lastY1);
                  var rotate = {
                    rotateAngle: rotateAngle
                  };
                  if (vectorCross < 0) {
                    rotate.direction = 'anticlockwise';
                    rotate.dirt = 0;
                  } else if (vectorCross > 0) {
                    rotate.direction = 'clockwise';
                    rotate.dirt = 1;
                  }
                  e.rotate = rotate;
                  callback(e);
                });
              }
            }
          },
          touchend: function (e) {
            lastArrOf2Touch = null;
          }
        }
      }
    });
  };

  var events = new Events();

  
  var MTEvents = function MTEvents() {
    this.userCallback2Handler = new Map();
  };
  
  MTEvents.prototype.bind = function bind (bindTarget, delegateTarget, event, callback) {
      var this$1 = this;

    // TODOS: Check arguments validity
    // arrange user input
    if (typeof delegateTarget === 'object') {
      this._handleEventObj(delegateTarget, function (event, handler) { return this$1.bind(bindTarget, undefined, event, handler); }
      );
      return bindTarget
    } else if (!(event instanceof Array) && typeof event === 'object') {
      this._handleEventObj(event, function (event, handler) { return this$1.bind(bindTarget, delegateTarget, event, handler); }
      );
      return bindTarget
    } else if (typeof event === 'function' || event instanceof Array) {
      return this.bind(bindTarget, undefined, delegateTarget, event)
    }
    bindTarget = this._checkBindTargetInput(bindTarget);
    var eventHandler = delegateProxyCreator(
      bindTarget,
      delegateTarget,
      callback
    );
    this.userCallback2Handler.set(callback, eventHandler);
    if (!this._isEventDIY(event)) {
      weakMapBinder(bindTarget, eventHandler, event);
    } else {
      events[event].bind(bindTarget, callback, delegateTarget);
    }
    return bindTarget
  };
  
  MTEvents.prototype.remove = function remove (bindTarget, event, callback) {
      var this$1 = this;

    bindTarget = this._checkBindTargetInput(bindTarget);
    if (typeof event === 'object') {
      this._handleEventObj(event, function (event, handler) {
        this$1.remove(bindTarget, event, handler);
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
  };
  
  MTEvents.prototype._handleEventObj = function _handleEventObj (eventObj, callback) {
    return Object.entries(eventObj).map(function (eventItem) {
      callback(eventItem[0], eventItem[1]);
    })
  };
  
  MTEvents.prototype._checkBindTargetInput = function _checkBindTargetInput (bindTarget) {
    if (typeof bindTarget === 'string') {
      bindTarget = document.querySelector(bindTarget);
      if (!bindTarget) {
        throw new Error(
          'None of DOM had been choisen, Please input a correct selector or a HTMLElement'
        )
      }
    }
    return bindTarget
  };
  
  MTEvents.prototype._isEventDIY = function _isEventDIY (event) {
    var _events = new Set(Object.keys(events));
    return _events.has(event)
  };

  var mtEvents = new MTEvents();
  var mtEventsPrototype = Object.create(MTEvents.prototype);
  var mtEventsFun = mtEvents.bind.bind(mtEvents);
  Object.setPrototypeOf(mtEventsFun, mtEventsPrototype);
  Object.keys(mtEvents).map(function (keyItem) {
    mtEventsFun[keyItem] = mtEvents[keyItem];
  });

  return mtEventsFun;
}))
