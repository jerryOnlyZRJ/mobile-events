# mt-events

------
## 引言

最近在 H5 与 app 联调的过程中，发现 H5 需要实现一些常用的移动端事件封装成接口提供给 app，这也是我们实现 mt-events 的初衷。

mt-events 全名是 Mobile Terminal Events。最初我们对这个库的定位是希望封装一些常用的移动端事件来方便用户进行更为便捷的移动端开发，例如双击事件、长按事件、滑动事件等等。后来，随着项目的迭代，mt-events 的功能更倾向往前端事件绑定工具的趋势发展，因为我们集成了事件委托等，你可以像使用 JQuery 的 on 方法那样使用我们的 mt-events，更加便捷事件绑定和委托，让移动端事件如原生事件般友好。 

接下来，我们将带你体验 mt-events 所拥有的魅力。 

------
## 功能
- 封装常用的**移动端事件**
  - 双击
  - 长按
  - 滑动
  - 拖拽
- 便捷事件**绑定**和**委托**
- 没有任何依赖性
- 代码压缩 + gzip，只有 **1.8KB**

------
## 用法

### 引用方式

npm包下载链接：https://www.npmjs.com/package/mt-events

如果你想在 HTML 页面里引入我们的 mt-events 工具库，可以通过如下方式：

```js
<script src="http://mtevents.jerryonlyzrj.com/mtevents.min.js"></script>
```

然后，我们的工具函数 mtEvents 将会被挂载在 window 对象上，你可以在浏览器的开发者工具里的 console 面板输入并执行 mtEvents，如果打印出如下文本说明您已经成功引入我们的工具库了：

![mtEvents-console](images/mtEvents-console.png)

或者你是 VUE 等前端框架的开发者，你也可以通过 npm 依赖的方式引入我们的工具。

首先，将我们的工具库以上线依赖的形式安装：

```shell
npm i mt-events --save
```

然后就可以在我们的 .vue 等文件里直接引入使用：

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

**实际上，工具函数 mtEvents 的执行环境还是在浏览器里，不论是通过 script 引入还是使用 npm 依赖，最后都需要在浏览器环境中执行。**

### 事件处理

#### 事件绑定：mtEvents(bindTarget，delegateTarget，event， callback)

工具函数 mtEvents 用于事件绑定，它默认可以传入4个参数，它们分别是：

* **bindTarget**

  类型：String(Selector) | HTMLElement

  事件绑定的DOM元素对象，传入的值可以是一个 DOM 元素或者符合 CSS 选择器规范的字符串，工具会自动选取被选择器选中的**第一个** DOM 元素。

* **delegateTarget**

  类型：String(Selector)

  事件委托元素，符合 CSS 选择器规范的字符串，如果你不需要这个值，可以忽略不填，具体可参考下方的示例代码。

* **event**

  类型：String

  单个事件的名称，可以是浏览器的原生事件，亦或是我们为你封装好的移动端常用事件（后方将会有封装事件的具体使用文档）。

* **callback**

  类型：Function

  事件触发时执行的回调函数，接受一个形参`event`，在回调函数执行时我们将传入触发回调的原生事件对象`event`。

#### 事件绑定代码示例

- **基础用法**：如果你单纯地想为某个元素绑定某个事件的回调，你可以这样使用 mtEvents：

```js
//你可以赋予第一个参数一个字符串
mtEvents('#bindTarget', 'click', e => console.log('BindTarget is clicked'))
//或者直接传入一个DOM对象
var bindTarget = document.querySelector('#bindTarget')
mtEvents(bindTarget, 'click', e => console.log('BindTarget is clicked'))
```

- **绑定封装事件**：同理，绑定我们为你封装的事件也是同样的方法：

```js
//此代码将为你的目标元素绑定长按事件
mtEvents('#bindTarget', 'longtap', e => console.log('BindTarget is longtap'))
```

- **使用事件委托**：如果你需要进行事件委托，只需要在第二个参数传入事件触发元素即可：

```js
mtEvents('#bindTarget', '#delegateTarget', 'click', e => console.log('BindTarget is clicked'))
```

如此一来，事件监听将会被绑定在 id 为 bindTarget 的 DOM 元素上，当 e.target 为 delegateTarget 或其子元素时，才会触发回调。

- **为单一元素绑定多个事件**：如果你需要为某个元素绑定多个事件回调，我们为你提供了便捷方案：

```js
mtEvents(node, {
    click: e => console.log('BindTarget is clicked'), 
    longtap: e => console.log('BindTarget is longtap')
})
```

你可以传入一个事件回调对象，对象的键是事件名称，值为事件对应的回调。

#### 事件移除：mtEvents.remove(bindTarget，event，callback)

工具函数 mtEvents 上挂载的 **remove** 方法用于移除你通过 mtEvents 绑定的事件，它默认可传入三个参数，它们分别是：

* **bindTarget**

  类型：String(Selector) | HTMLElement

  同理事件绑定方法，事件绑定的 DOM 元素对象，传入的值可以是一个 DOM 元素或者符合 CSS 选择器规范的字符串，工具会自动选取被选择器选中的**第一个 **DOM 元素。

* **event**

  类型：String

  同理事件绑定，你绑定在元素上的事件名称。

* **callback**

  类型：Function

  相应事件触发时执行的回调函数。

#### 事件移除代码示例

同理事件绑定，你可以使用基础用法移除某个元素上的绑定事件：

```js
const handler = () => console.log('handler')
mtEvents('#bindTarget', 'click', handler)
mtEvents.remove('#bindTarget', 'click', handler)
```

**特别注意：如果你后续需要移除事件，在事件绑定时请不要使用匿名函数！！！否则将无法正常移除事件。**

你也可以像事件绑定时那样传入一个事件回调对象来移除多个事件绑定：

```js
const clickHandler = () => console.log('clickHandler')
const longtapHandler = () => console.log('longtapHandler')
mtEvents.remove(node, {
    click: clickHandler, 
    longtap: longtapHandler
})
```

### 封装事件

#### longtap

移动端长按事件，通过监听 touchstart 和 touchend 判断用户 touch 的时间是否超过指定阈值（默认为1s）触发事件，使用方法：

```js
mtEvents('#bindTarget', 'longtap', e => console.log('BindTarget is longtap'))
```

封装事件 longtap 的 callback 还可以接受一个数组，你也可以使用如下方法传入 callback：

```js
const longtap = e => console.log('BindTarget is longtap')
const shorttap = e => console.log('BindTarget is shorttap')
mtEvents('#bindTarget', 'longtap', [longtap, shorttap])
```

这么一来，用户如果长按，将触发长按事件，如果短按，将触发短按事件。

#### dbtap

移动端双击事件，通过监听两次 tap 的间隔时间和位置判断用户是否在某一范围内双击屏幕，使用方法：

```js
mtEvents('#bindTarget', 'dbtap', e => console.log('BindTarget is dbtap'))
```

#### drag

移动端拖拽事件，通过监听 touchstart 和 touchend 的位置判断用户的手势发生了哪些偏移，执行相应回调，具体使用方法：

```js
mtEvents('#bindTarget', 'drag', e => console.log('BindTarget is drag'))
```

你可以为 callback 传入一个回调，分别表示用户进行上下左右拖拽时执行的回调函数：

```js
const up = e => console.log('up')
const down = e => console.log('down')
const left = e => console.log('left')
const right = e => console.log('right')
mtEvents('#bindTarget', 'drag', [up, right, down, left])
```

**callback 数组的顺序是顺时针方向即“上右下左”，如果传入只有一个 callback 的 callback 数组则与单纯传入一个 callback function 同样的效果；如果数组内有两个 callback，则数组第一项为纵向事件拖拽回调，第二项为横向拖拽回调；如果数组有三项，则第一项为up拖拽回调，第二项为横向拖拽回调，第三项为 down 拖拽回调。**

**特别注意：横向事件的回调执行优先级大于纵向事件的回调执行优先级，即横向事件的回调会先于纵向事件的回调先行触发。**

#### swift

移动端滑动事件，通过监听 touchmove 判断用户手势发生了哪些偏移，执行相应回调。

** swift 与 drag 的不同**：swift 会持续监听用户手势，只要发生移动就持续触发事件，而 drag 值关注用户手势的初始位置和结束为止，只会在 touchend 的时候触发一次事件。

用法完全类同 drag，这里就不再做相关描述。

------
## 工程化搭建

### 目录结构
```shell
mt-events
├── core                   # 核心代码
│   ├── event.js           # 自定义事件处理句柄生成器，包含长按，双击，滑动，拖拽事件
│   ├── index.js           # mtEvents 类以及绑定，移除事件方法
│   ├── proxy.js           # 事件代理 Proxy 生成器
│   ├── touch.js           # 模拟浏览器原生 touch 事件
│   ├── weakmap.js         # 设置 DOM 元素对应的 callback，移除DOM元素相对应的 callback 也去除
├── dist
│   ├── mtevents.min.js    # mt-events 工具库最终生成的 js 文件
├── docs                   
│   ├── developer          # 使用 jsdoc 生成 js 库或者模块的 API 文档
│   ├── user               # mt-events 的中英文使用文档
├── lib                    # 使用 rollup 减少冗余代码，区分 browser 和 npm 方式引用
│   ├── event.js           
│   ├── index-Browser.js   # browser 方式引用
│   ├── index-npm.js       # npm 方式引用
│   ├── proxy.js           
│   ├── touch.js           
│   ├── weakmap.js                  
├── test
│   ├── coverage           # 测试覆盖率
│   ├── index.js           # 测试用例
├── .travis.yml            # travis-ci构建部署到服务器，一发布新版本用户即可以拿到最新 mtevents 代码
├── jest.config.js         # jest 配置文件
├── package.json           # 配置文件
├── rollup.config.js       # rollup 配置文件
├── swebpack.config.js     # webpack4 打包配置文件 
```
### 框架搭建

####  工具选型 
```bash
构建： webpack4
js 模块打包器： Rollup
单元测试工具： Jest
构建部署服务器: Travis CI 
生成 API 文档工具： JSDoc
语法支持： es6
语法规范： eslint + prettier
项目管理工具： git
```
#####   JavaScript 模块打包器 Rollup
​	Rollup 已被许多主流的 JavaScript 库使用，它对代码模块使用新的标准化格式，这些标准都包含在 JavaScript 的 ES6 版本中，这可以让你自由无缝地使用你需要的 lib 中最有用的独立函数。Rollup 还为 mt-events实现了同构，分为 index-npm.js 和 index-Browser.js 文件，既可以通过 script 引入，也可以使用 npm 依赖。 

​	除了使用 ES6 模块，Rollup 具有 Tree Shaking 特性，可以静态分析导入模块，移除没用到的代码，尽量地减少代码体积。

``` javascript
// index.js  
if (process.env.PLATFORM === 'Browser') {
  window.mtEvents = mtEventsFun
} else {
  module.exports = mtEventsFun
}
// rollup.config.js  
export default {
    entry: './core/index.js',
    output: {
        file: `lib/index-${platform}.js`,
        format: 'cjs'
    },
    plugins: [
        replace({
            "process.env.PLATFORM": JSON.stringify(platform)
        }),
        copy({
            './core/events.js': 'lib/events.js',
            './core/proxy.js': 'lib/proxy.js',
            './core/weakmap.js': 'lib/weakmap.js',
        })
    ]
};

// package.json  根据传入的参数生成对应的 index-npm.js 和 index-Browser.js 文件
// 在相应的 index-${platform}.js 文件移除没用到的代码
{
    "build:browser": "rollup --config --platform Browser",
    "build:npm": "rollup --config --platform npm"
}

// index-npm.js
{
  module.exports = mtEventsFun;
}

// index-Browser.js
{
  window.mtEvents = mtEventsFun;
}
```

#####  单元测试工具 Jest
​	随着项目迭代的过程，依赖人工去回归测试容易出错和遗漏，为了保证 mt-events 库的质量，以及自动化测试，我们引入了单元自动化测试。目前测试工具很多，例如 Jest，Mocha，Jasmine，Tape等，下面我们对这几种框架进行了一些对比。

- Jest
  - facebook 开源的 js 单元测试框架
  - **集成 JSDOM，mt-events 库主要适用于移动端，集成 JSDOM 能够让我们更好地去模拟移动端事件**
  - 基于 Istanbul 的测试覆盖率工具，会在项目下生产一个 coverage 目录，内附一个优雅的测试覆盖率报告，让我们可以清晰看到优雅的测试情况
  - 开箱即用，配置很少，只需要 npm 命令安装即可运行
  - 内置 Jasmin 语法，以及添加了很多新特性
  - 内置 auto mock，自带 mock API
  - 支持断言和仿真，不需要引入第三方断言库
  - 在隔离环境下测试，支持快照测试
- Mocha
  - 灵活，可配置扩展性强
  - 社区成熟
  - 需要较多的配置
- Tape
  - 最精简，体积最小，只提供最关键的东西
  - 只提供最底层的 API

  最终我们的单元测试工具的选择是 **Jest**，集成 **JSDOM**，容易上手，开箱即用，几乎零配置，功能全面。

#####  API 文档工具 JSDoc

- JSDoc 是一个根据 javascript 文件中注释信息，生成 JavaScript 应用程序或库、模块的 API 文档 的工具
- JSDoc 本质是代码注释，根据它一定的格式和规则去写，这样就能很方便生产智能提示和 mt-events API 文档

#####  持续集成服务 Travis CI 

###### 特性

- Travis CI 提供的是持续集成服务，它仅支持 Github，不支持其他代码托管。
- 它需要绑定 Github 上面的项目，还需要该项目含有构建或者测试脚本。
- 只要有新的代码，就会自动抓取。然后，提供一个运行环境，执行测试，完成构建，还能部署到服务器。
- 只要代码有变更，就自动运行构建和测试，反馈运行结果。确保符合预期以后，再将新代码集成到主干。
- 每次代码的小幅变更，就能看到运行结果，从而不断累积小的变更，而不是在开发周期结束时，一下子合并一大块代码，这大大提高了开发 mt-events 库的效率，只要一更新，用户即可拉取到最新的 js 代码。

###### 配置

​	Travis 要求项目的根目录下面，必须有一个`.travis.yml`文件。这是配置文件，指定了 Travis 的行为。该文件必须保存在 Github 仓库里面，一旦代码仓库有新的 Commit，Travis 就会去找这个文件，执行里面的命令。 

```shell
// .travis.yml
language: node_js
node_js:
- 8.11.2
cache:
  directories:
  - node_modules
after_success:
- npm run codecov
- scp -i mtevents_travis_key -P $DEPLOY_PORT -o stricthostkeychecking=no -r dist/mtevents.min.js
  $DEPLOY_USER@$DEPLOY_HOST:/usr/local/nginx/html
```
​	最后部署，运行。根据运行返回状态，来判断是否运行成功。

------
## 源码剖析

​	mt-events 源码都是按照 ES6 代码规范来写，下面从几个方面来体验 mt-events 源码的魅力：

- 工具函数 mtEvents

  - 通常 mtEvents 原来只是个类实例，如果想要使用事件绑定处理方法，则需要 mtEvents.bind() 来实现。那我们是不是可以考虑让 mtEvents 既是一个 function，也是一个 Object 呢？
  - 通过 Object.create(MTEvents.prototype) 来获取 mtEvents 的原型对象，mtEvents.bind.bind() 改变 this 指针的指向， 将其 mtEventsFun 绑定多个方法，实现 mtEvents 既是一个 function，也是一个 Object，方便开发者使用。

```javascript
// index.js
let mtEvents = new MTEvents()
const mtEventsPrototype = Object.create(MTEvents.prototype)
const mtEventsFun = mtEvents.bind.bind(mtEvents)
Object.setPrototypeOf(mtEventsFun, mtEventsPrototype)
Object.keys(mtEvents).map(keyItem => {
  mtEventsFun[keyItem] = mtEvents[keyItem]
})
```
![mtEvents-bind](images/mtevents-binds.png)

- 用户 callback
  - 我们定义 userCallback2Handler 为一个 map，将用户自定义的 callback 与事件处理器 eventHandler 绑定起来，相应的 remove 的时候也是根据 callback 来进行移除事件绑定。
  - 另外 weakmap.js 的意义在于设置 DOM 元素对应的 callback，移除DOM元素相对应的 callback 也要对应的移除，防止内存泄漏。
```javascript
// index.js
this.userCallback2Handler = new Map()
this.userCallback2Handler.set(callback, eventHandler)

// weakmap.js
function weakMapCreator (htmlElement, callback) {
    let weakMap = new WeakMap()
    weakMap.set(htmlElement, callback)
    return weakMap
}
```


- 事件代理处 proxy 生成器 

  在 proxy.js 源码中，定义了事件代理处理的方法：_delegateEvent，以及事件代理Proxy生成器：delegateProxyCreator，这样用户传入的参数：事件绑定元素，事件代理元素，callback 全部都得经过我们自己的事件代理Proxy生成器，进行相应的事件代理处理，这样可以大大减少代码量，使代码看起来更加精简美观，同时这样定位问题 bug 也变得简单很多，只需要从根源处去定位 bug 即可。

```javascript
/**
 * _delegateEvent 事件代理处理
 * @param  {String(Selector) | HTMLElement} bindTarget     事件绑定元素
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
 * @param  {String(Selector) | HTMLElement} bindTarget     事件绑定元素
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
```



