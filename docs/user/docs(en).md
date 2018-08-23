# mt-events developer documentation

Event binding and delegation made easy. Handle mobile events on the web.

## Introduction

### What is mt-events？

mt-events is short for Mobile Terminal Events. At first we wanted to develop a package of handlers for mobile events such as double click, long tap and swipe, in order to ease the mobile development process for front-end developers. Later on, we integrated things like event delegation, so mt-events is evolving into a full-fledged event-handling tool. Therefore, you could use mt-events very similar to the way you would use JQuery. What's best is that the size of our library is only 2KB after gzip. You could download it or use the `script` tag to import the url provided. Now lets dive into the details of using this light-weighted event-handling library.

### Getting Started

First, import mt-events in your HTML as such:

```js
<script src="http://mtevents.jerryonlyzrj.com/mtevents.min.js"></script>
```

After the import, our `mtEvents` function will be attached to the `window` object. Open your browser dev tool's console tab and enter `mtEvents`, if you see the printed text below then you have successfully included our library.

![mtEvents-console](images/mtEvents-console.png)

If you are developing with frameworks like Vue.js, you could install our library via npm:

```shell
npm i mt-events --save
```

Then require and use mt-events in your .vue file, etc:

```html
//test.vue
<script>
const mtEvents = require('mt-events')
export default {
    ...,
    mounted(){
      mtEvents('#bindTarget', 'click', e => console.log('click'))
    }
}
</script>
```

**Note: No matter how you imported the library (with script or npm), eventually mtEvents needs to run in the browser enviroment.**

### Event Handling

#### Event-binding：`mtEvents(bindTarget, delegateTarget, event, callback)`

the `mtEvents` helper function is used for event-binding，the four default parameters are：

* **bindTarget**

  Type：String(Selector) | HTMLElement

  The DOM target of this event-binding; could be a DOM element or a CSS selector string (the **first** element matching the selector will be selected)

* **delegateTarget** (optional)

  Type：String(Selector)

  Event-delegation target; an optional CSS selector string.

* **event**

  Type：String

  The name of this event; could be a native web event or a mobile event included in our library.

* **callback**

  Type：Function

  The event callback function; has a native event-target `event` parameter, which will be passed in when the callback gets executed.


#### Event Binding examples

1⃣️ **basic usage**：If you just want to bind a callback function to an event, use mtEvents as such:

```js
// the first argument could be a string
mtEvents('#bindTarget', 'click', e => console.log('BindTarget is clicked'))
// or a DOM element
var bindTarget = document.querySelector('#bindTarget')
mtEvents(bindTarget, 'click', e => console.log('BindTarget is clicked'))
```

2⃣️ **bind an event included in our library**：

```js
// bind a callback to the 'longtap' event
mtEvents('#bindTarget', 'longtap', e => console.log('BindTarget is longtap'))
```

3⃣️ **Event Delegation**：pass in the delegate element as the second argument：

```js
mtEvents('#bindTarget', '#delegateTarget', 'click', e => console.log('BindTarget is clicked'))
```
This way, the event listener will bind to the DOM element whose ID equals to bindTarget. When `e.target` is delegateTarget or its child element, the callback will be executed.

4⃣️ **bind multiple events to one element**: pass in an object in which the keys are the event names and the values are the corresponding callbacks.

```js
mtEvents(node, {
    click: e => console.log('BindTarget is clicked'),
    longtap: e => console.log('BindTarget is longtap')
})
```

#### Event Removal：mtEvents.remove(bindTarget, event, callback)

The utility function `mtEvents.remove` should be used to remove the events you have attached with `mtEvents`, the parameters are:

* **bindTarget**

  Type: (Selector) | HTMLElement

  Same as the bindTarget parameter for Event Binding:
  The DOM target of this event-binding; could be a DOM element or a CSS selector string (the **first** element matching the selector will be selected).

* **event**

  Type：String

  Same as the event parameter for Event Binding:
  The event name you have bound to the element.

* **callback**

  Type：Function

  The event callback function

#### Event Removal example：

The basic usage is the following:

```js
const handler = () => console.log('handler')
mtEvents('#bindTarget', 'click', handler)
mtEvents.remove('#bindTarget', 'click', handler)
```

**Note: If you need to remove an event, do not use an anonymous function for event binding. If you do, the event could be not properly removed.**

To remove more than one event, pass in an object just like for Event Binding ：

```js
const clickHandler = () => console.log('clickHandler')
const longtapHandler = () => console.log('longtapHandler')
mtEvents.remove(node, {
    click: clickHandler,
    longtap: longtapHandler
})
```

## Custom Events

### tap

The mobile tap event. We listen for the touchstart and touchend mobile event to determine if the touch duration exceeds a certain threshold (default to 300ms). Usage:

```js
mtEvents('#bindTarget', 'tap', e => console.log('BindTarget is tap'))
```

### longtap

The mobile long-tap event. We listen for the touchstart and touchend mobile event to determine if the touch duration exceeds a certain threshold (default to 1s). Usage:

```js
mtEvents('#bindTarget', 'longtap', e => console.log('BindTarget is longtap'))
```

the callback parameter could also be an array：

```js
const longtap = e => console.log('BindTarget is longtap')
const shorttap = e => console.log('BindTarget is shorttap')
mtEvents('#bindTarget', 'longtap', [longtap, shorttap])
```

This way you could listen for both short and long tap at the same time.

### dbtap

The mobile double-tap event. We listen for the time duration and location differences between two taps to determine if the user is double-clicking in a certain area. Usage:

```js
mtEvents('#bindTarget', 'dbtap', e => console.log('BindTarget is dbtap'))
```

### swipe

The mobile swipe event. We listen for the touchstart and touchend mobile event to determine if the user's touch has moved. Usage：

```js
mtEvents('#bindTarget', 'drag', e => console.log('BindTarget is drag'))
```

You could pass an array of callbacks for swipe events in all four directions:

```js
const up = e => console.log('up')
const down = e => console.log('down')
const left = e => console.log('left')
const right = e => console.log('right')
const vertical = e => console.log('vertical')
const horizontal = e => console.log('horizontal')
const move = e => console.log('move')
// 4 params
mtEvents('#bindTarget', 'drag', [up, right, down, left])
// 3 params
mtEvents('#bindTarget', 'drag', [up, horizontal, down])
// 2 params
mtEvents('#bindTarget', 'drag', [vertical, horizontal])
// 1 param
mtEvents('#bindTarget', 'drag', [move])
```

**Special Notice: the priority of horizontal swipes is higher than that of vertical swipes, which means horizontal callbacks will be executed first.**

### drag

The mobile drag event. We listen for the mobile touchmove event to determine the path of the drag.

**difference between drag and swipe**：
drag listens for the user's gesture continuously, and executes the callback whenever the drag moves; drag only cares about the beginning and end position of the drag, and only executes the callback on touchend.