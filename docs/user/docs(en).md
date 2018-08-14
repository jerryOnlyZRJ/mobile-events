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

the `mtEvents` helper function is used for event-binding，the 4 default parameters are：

* **bindTarget**

  Type：String(Selector) | HTMLElement

  The DOM target of this event-binding; could be a Dom element or a CSS selector string (the **first** element matching the selector will be selected)

* **delegateTarget** (optional)

  Type：String(Selector)

  Event-delegation target; an optional CSS selector string.

* **event**

  Type：String

  The name of this event; could be a native web event or a mobile event included in our library.

* **callback**

  Type：Function

  The event callback function; has a native event-target `event` parameter, which will be passed in when the callback gets executed.

#### 事件绑定代码示例

1⃣️**基础用法**：如果您单纯地想为某个元素绑定某个事件的回调，你可以这样使用mtEvents：

```js
//您可以赋予第一个参数一个字符串
mtEvents('#bindTarget', 'click', e => console.log('BindTarget is clicked'))
//或者直接传入一个DOM对象
var bindTarget = document.querySelector('#bindTarget')
mtEvents(bindTarget, 'click', e => console.log('BindTarget is clicked'))
```

2⃣️**绑定封装事件**：同理，绑定我们为您封装的事件也是同样的方法：

```js
//此代码将为您的目标元素绑定长按事件
mtEvents('#bindTarget', 'longtap', e => console.log('BindTarget is longtap'))
```

3⃣️**使用事件委托**：如果您需要进行事件委托，只需要在第二个参数传入事件触发元素即可：

```js
mtEvents('#bindTarget', '#delegateTarget', 'click', e => console.log('BindTarget is clicked'))
```

如此一来，事件监听将会被绑定在id为bindTarget的DOM元素上，当e.target为delegateTarget或其子元素时，才会触发回调。

4⃣️**为单一元素绑定多个事件**：如果您需要为某个元素绑定多个事件回调，我们为您提供了便捷方案：

```js
mtEvents(node, {
    click: e => console.log('BindTarget is clicked'),
    longtap: e => console.log('BindTarget is longtap')
})
```

您可以传入一个事件回调对象，对象的键是事件名称，值为事件对应的回调。

#### 事件移除：mtEvents.remove(bindTarget, event, callback)

工具函数mtEvents上挂载的**remove**方法用于移除您通过mtEvents绑定的事件，它默认可传入三个参数，它们分别是：

* **bindTarget**

  Type：String(Selector) | HTMLElement

  同理事件绑定方法，事件绑定的DOM元素对象，传入的值可以是一个DOM元素或者符合CSS选择器规范的字符串，工具会自动选取被选择器选中的**第一个**DOM元素。

* **event**

  Type：String

  同理事件绑定，您绑定在元素上的事件名称。

* **callback**

  Type：Function

  相应事件触发时执行的回调函数。

#### 事件移除代码示例：

同理事件绑定，您可以使用基础用法移除某个元素上的绑定事件：

```js
const handler = () => console.log('handler')
mtEvents('#bindTarget', 'click', handler)
mtEvents.remove('#bindTarget', 'click', handler)
```

**特别注意：如果您后续需要移除事件，在事件绑定时请不要使用匿名函数！！！否则将无法正常移除事件。**

您也可以像事件绑定时那样传入一个事件回调对象来移除多个事件绑定：

```js
const clickHandler = () => console.log('clickHandler')
const longtapHandler = () => console.log('longtapHandler')
mtEvents.remove(node, {
    click: clickHandler,
    longtap: longtapHandler
})
```

## 封装事件

#### tap

移动端单击事件，通过监听 touchstart 和 touchend 判断用户 touch 的时间是否超过指定阈值（默认为300ms）触发事件，使用方法：

```js
mtEvents('#bindTarget', 'tap', e => console.log('BindTarget is tap'))
```

### longtap

移动端长按事件，通过监听touchstart和touchend判断用户touch的时间是否超过指定阈值（默认为1s）触发事件，使用方法：

```js
mtEvents('#bindTarget', 'longtap', e => console.log('BindTarget is longtap'))
```

封装事件longtap的callback还可以接受一个数组，您也可以使用如下方法传入callback：

```js
const longtap = e => console.log('BindTarget is longtap')
const shorttap = e => console.log('BindTarget is shorttap')
mtEvents('#bindTarget', 'longtap', [longtap, shorttap])
```

这么一来，用户如果长按，将触发长按事件，如果短按，将触发短按事件。

### dbtap

移动端双击事件，通过监听两次tap的间隔时间和位置判断用户是否在某一范围内双击屏幕，使用方法：

```js
mtEvents('#bindTarget', 'dbtap', e => console.log('BindTarget is dbtap'))
```

### drag

移动端拖拽事件，通过监听touchstart和touchend的位置判断用户的手势发生了哪些偏移，执行相应回调，具体使用方法：

```js
mtEvents('#bindTarget', 'drag', e => console.log('BindTarget is drag'))
```

您可以为callback传入一个回调，分别表示用户进行上下左右拖拽时执行的回调函数：

```js
const up = e => console.log('up')
const down = e => console.log('down')
const left = e => console.log('left')
const right = e => console.log('right')
mtEvents('#bindTarget', 'drag', [up, right, down, left])
```

**callback数组的顺序是顺时针方向即“上右下左”，如果传入只有一个callback的callback数组则与单纯传入一个callback function同样的效果；如果数组内有两个callback，则数组第一项为纵向事件拖拽回调，第二项为横向拖拽回调；如果数组有三项，则第一项为up拖拽回调，第二项为横向拖拽回调，第三项为down拖拽回调；**

**特别注意：横向事件的回调执行优先级大于纵向事件的回调执行优先级，即横向事件的回调会先于纵向事件的回调先行触发。**

### swift

移动端滑动事件，通过监听touchmove判断用户手势发生了哪些偏移，执行相应回调。

**swift与drag的不同**：swift会持续监听用户手势，只要发生移动就持续触发事件，而drag值关注用户手势的初始位置和结束为止，只会在touchend的时候触发一次事件。

用法完全类同drag，这里就不再做相关描述。
