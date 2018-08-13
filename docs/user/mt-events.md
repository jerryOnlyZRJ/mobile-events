# mt-events

## 需求分析

最近在 H5 与APP联调的过程中， 经常需要实现一些常用的移动端事件封装成接口提供给 app，例如用户的单击tap事件、双击事件、长按事件以及拖动事件。但由于浏览器默认只提供了`touchstart`、`touchmove`、`touchend`三个原生事件，在实际的开发过程中，我们常用的解决方案便是通过监听`touchstart`和`touchend`事件配合定时器来实现我们的自定义移动端事件，为了实现常用自定义事件的复用，我们对其进行了封装，并提供方便用户使用的工具函数，这也是我们实现 mt-events 的初衷。

mt-events 全名是 Mobile Terminal Events。最初我们对这个库的定位是希望封装一些常用的移动端事件来方便用户进行更为便捷的移动端开发，例如双击事件、长按事件、滑动事件等等。后来，随着项目的迭代，mt-events 的功能更倾向往前端事件绑定工具的趋势发展，因为我们集成了事件委托等，您可以像使用 JQuery 的 on 方法那样使用我们的 mt-events，更加便捷事件绑定和委托，让移动端事件如原生事件般友好。 这是我们项目的Github地址：https://github.com/jerryOnlyZRJ/mobile-events 。

接下来，我们将带您体验一款工具库的搭建流程，ES6新特性Map、Proxy、Reflect以及WeakMap在我们的工具库中发挥的作用，以及我们开源的工具库**mt-events**所拥有的魅力。 

------
## mt-events初探

先看看mt-events这款工具库具有哪些特性：

- 普遍性：封装常用的**移动端事件**：
  - 单击
  - 双击
  - 长按
  - 滑动
  - 拖拽
- 便捷性：在全局挂载工具函数，绑定事件如$.on()般丝滑；封装事件代理，只需要像JQuery那样传入被代理元素的选择器即可。
- 新语法：使用Map映射事件回调，便捷事件移除；使用WeakMap实现DOM元素与回调的弱引用，预防内存泄漏。
- 轻量级：代码压缩 + gzip，只有大约 **2KB**。

那么，我们又该如何使用它呢？这里提供了两种饮用工具库的方式，最常用的当然是从HTML里使用script引入：

```js
<script src="http://mtevents.jerryonlyzrj.com/mtevents.min.js"></script>
```

然后，我们的工具函数 mtEvents 将会被挂载在 window 对象上，您可以在浏览器的开发者工具里的 console 面板输入并执行 mtEvents，如果打印出如下文本说明您已经成功引入我们的工具库了：

![mtEvents-console](/Users/ranjayzheng/Desktop/mobile-events/docs/user/images/mtevents-console.png)

或者您是 VUE 等前端框架的开发者，您也可以通过 npm 依赖的方式引入我们的工具，我们的工具库会跟随您们的VUE文件被打包进bundle里。

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

具体的使用方法，您可以参照我们Github为您提供的用户文档哦～

## 如何搭建一款属于我们自己的开源库

### 选择一款合适的测试工具

​	没有经过测试的代码不具备任何说服性 。相信大家在浏览别人开源的工具库代码时，都能在根目录下见到一个名为test的文件夹，其中就放置着项目的测试文件。特别对于工具库来说，测试更是一个不可或缺的环节。

​	市面上的测试工具种类繁多，例如 Jest，Mocha，Jasmine，Tape等，并不需要局限与哪一款，下面我们对这几种框架进行了一些对比。

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

### 使用eslint规范团队代码

在团队开发的工作中，代码规范是保障代码可读性的重要措施之一，

### 选择您最熟悉的构建工具

### 配置JSDoc为后来之人扫清障碍

​	项目的维护工作是延伸项目生命周期的最关键手段，阅读别人的源码相信对大家来说都是一件费力的事情，特别是当原作者不在您身边或者无法给您提供任何信息的时候，那就更是悲从中来。所以，书写完善的注释是开发过程中需要养成的良好习惯。为了提升代码的可维护性，我们都会在主干代码上完善我们的注释，并且，市面上有一款工具，它能够自动将我们的注释转化成API文档，生成可视化页面，听起来是很神奇吧，先别着急，听我娓娓道来。

​	这款工具名为JSDoc，它是一款根据 Javascript 文件中注释信息，生成 JavaScript 应用程序或库、模块的 API 文档的工具。JSDoc 分析的源代码是我们书写的符合Docblock格式的代码注释，它会智能帮我们生成美观的API文档页面，我们要做的，只是简单的跑一句`jsdoc`命令就可以了。

下面是 mt-events的 API 文档（很美观不是吗？这些都是JSDoc自动生成的）：
![mtEvents-docs](/Users/ranjayzheng/Desktop/mobile-events/docs/user/images/mtevents-docs.png)

​	简约的风格让人开起来心旷神怡，想想如果有后来的维护者想要快速了解您的项目的大体架构和具体方法的功能，献上这样一份开发者文档可不是要比直接丢给他一份源代码要来的好得多对吧。

### 让持续集成工具帮您实现自动化部署

### 为您的项目添加开源许可证

### 添加一些您喜欢的Icon来修饰您的项目吧

## mt-events从0到1

### 目录结构
```shell
mt-events
├── core                   # 源代码文件夹
│   ├── event.js           # 自定义事件处理句柄生成器，包含长按，双击，滑动，拖拽事件
│   ├── index.js           # mtEvents 类以及绑定，移除事件方法
│   ├── proxy.js           # 事件代理 Proxy 生成器
│   ├── touch.js           # 模拟浏览器原生 touch 事件，供test使用，未对外发布
│   ├── weakmap.js         # 建立用户定义回调与事件绑定元素的弱引用，预防内存泄漏
├── dist
│   ├── mtevents.min.js    # mt-events 工具库最终生成的 JS 上线压缩文件
├── docs                   
│   ├── developer          # 为开发者提供的mt-events开发文档，使用命令`$npm run docs`即可生成
│   ├── user               # 为用户提供的mt-events的中英文使用文档
├── lib                    # 上线待构建代码临时文件夹
│   ├── event.js           
│   ├── index-Browser.js   # 上线压缩JS源文件
│   ├── index-npm.js       # npm package入口文件
│   ├── proxy.js                    
│   ├── weakmap.js                  
├── test
│   ├── coverage           # 测试覆盖率参考文件
│   ├── index.js           # 测试用例
├── .travis.yml            # Travis-ci配置文件
├── jest.config.js         # Jest 配置文件
├── package.json           
├── rollup.config.js       # rollup 配置文件
├── webpack.config.js      # webpack配置文件 
```
这是一份平平无奇的项目目录，大家一定能看到很多熟悉的字眼，我们都对其中的文件的用途进行了解释说明，具体关键细节和重点，我们会在后文中提炼出来。

### 工程化实践

![images](images/engineering.jpeg)

####  工具选型 
```bash
构建： webpack4 Rollup
测试工具： Jest
持续集成: Travis CI 
API 文档生成工具： JSDoc
代码规范： eslint  prettier lint-staged
项目管理工具： git
```
#####   JavaScript 模块打包器 Rollup
​	Rollup 已被许多主流的 JavaScript 库使用，它对代码模块使用新的标准化格式，这些标准都包含在 JavaScript 的 ES6 版本中，这可以让您自由无缝地使用您需要的 lib 中最有用的独立函数。Rollup 还帮助 mt-events实现了简单的“同构”，通过区分用户的引用方式，我们将上线文件区分为 index-npm.js 和 index-Browser.js 文件，既可以通过 script 在HTML引入，也可以使用 npm 方式 require 依赖。 

​	除了使用 ES6 模块，Rollup 独树一帜的 Tree Shaking 特性，可以静态分析导入模块，移除冗余，帮助我们完成了代码无用分支的裁剪：

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

​	随着项目迭代的过程，依赖人工去回归测试容易出错和遗漏，为了保证 mt-events 库的质量，以及实现自动化测试，我们引入了Jest，因为它集成了 **JSDOM**，用它模拟我们的事件库在浏览器环境中执行的效果再合适不过了。并且Jest容易上手，开箱即用，几乎零配置，功能全面。

​	但是在测试的开始阶段就遇到了一个问题，在浏览器原生移动端事件中，并没有一个像click()那样的方法可以供我们直接调用来模拟事件触发，这个问题又该如何解决呢？

​	利用挂载在全局的TouchEvent构造函数，我们尝试着创建用户的touch事件，最终实践证明，这个方法可行，下方便是我们模拟touch事件的核心代码：

```javascript
// touch.js
createTouchEvent (type) {
    return new window.TouchEvent(type, {
        bubbles: true,
        cancelable: true
    })
}
dispatchTouchEvent (eventTarget, event) {
    if (typeof eventTarget === 'string') {
        eventTarget = document.querySelector(eventTarget)
    }
    eventTarget.dispatchEvent(event)
    return eventTarget
}
```

​	下面是我们使用 Jest 测试代码的覆盖率及结果：
![mtEvents-test](images/mtevents-test.png)

#####  持续集成服务 Travis CI 

###### 特性

- Travis CI 提供的是持续集成服务，它仅支持 Github，不支持其他代码托管。
- 它需要绑定 Github 上面的项目，还需要该项目含有构建或者测试脚本。
- 只要有新的代码，就会自动抓取。然后，提供一个虚拟机环境，执行测试，完成构建，还能部署到服务器。
- 只要代码有变更，就自动运行构建和测试，反馈运行结果。确保符合预期以后，再将新代码集成到主干。
- 每次代码的小幅变更，就能看到运行结果，从而不断累积小的变更，而不是在开发周期结束时，一下子合并一大块代码，这大大提高了开发 mt-events 库的效率，只要一更新，用户即可拉取到最新的 js 代码。这就是增量上线。

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
  $DEPLOY_USER@$DEPLOY_HOST:/usr/local/nginx/html​
```
## 源码剖析

mt-events 源码都是按照 ES6 代码规范来写，下面从几个方面来体验 mt-events 源码的魅力：

### 一个既是Function又是Object的工具函数

​	如此奇葩的数据类型看起来似乎很陌生，但我敢保证您之前一定有见过，只是没注意到它罢了，而且是多年以前我们最经常打交道的老朋友。还记得JQuery里面的 **$** 符号嘛？你一定用过这种写法去获取元素`$("#myDom")`，也用过挂在 $ 上的ajax方法来发送请求就像这样：`$.ajax(...)`，是不是被我这么一说忽然发现，之前最常用的 **$** 居然既是个函数又是个对象，很少见这样的情况对吧，其实实现原理很简单，只需要把类实例的原型挂载到Function上就搞定了，之所以这么做，是为了让用户绑定事件时，直接使用**mtEvents**这个Function就可以了，就不需要再去拿到mtEvents上的bind方法了，能够优化体验。具体实现代码如下：

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

### 移除事件时需要传递指针，怎么让用户的回调和我们绑定在元素上的事件回调形成映射？

​	     在自定义事件中，我们是通过同时监听`touchstart`和`touchend`两个事件来判断用户触发的事件类型，并且在指定的位置执行用户传入的回调。那么，当用户需要移除之前绑定的事件时，我们又该如何处理呢？用户传入的肯定是需要执行的回调，而不是我们绑定在元素上的事件回调。

​	这时候，我们就需要对用户传入的执行回调和我们绑定在事件监听上的回调建立映射关系了，这样我们就可以依据用户传入的执行回调找到我们所需要移除的事件绑定回调函数了。对于映射关系，我们首先想到的肯定就是对象了，但是在传统的JS里，对象的键只能是字符串，但是我们需要让它是一个函数，这回就该想到我们ES6里新增的数据类型Map了，他的键可以不限于字符串，正合我意。

​	我们定义 userCallback2Handler 为一个 Map，将用户自定义的 callback 与事件处理器 eventHandler 绑定起来，相应的 remove 的时候也是根据 callback 来进行移除事件绑定，自定义事件中也是同理。

### 用户移除DOM元素时忘了移除绑定的事件怎么办？让WeakMap弱引用和内存泄漏Say goodbye!

 ```	
	WeakMap 就是为了解决这个问题而诞生的，它的键名所引用的对象都是弱引用，即垃圾回收机制不将该引用考虑在内。因此，只要所引用的对象的其他引用都被清除，垃圾回收机制就会释放该对象所占用的内存。也就是说，一旦不再需要，WeakMap 里面的键名对象和所对应的键值对会自动消失，不用手动删除引用。
															--摘自 阮一峰《ECMAScript 6 入门》
 ```

​	 weakmap.js 的意义在于建立DOM 元素与对应 callback的弱引用，在移除DOM元素时绑定在该元素上的回调也会被GC回收，这样就能起到防止内存泄漏的作用。

```javascript
// weakmap.js

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
```

### 事件委托的代码每次绑定事件都得写一次，用Proxy—Reflect快速去重

​	在开发的过程中我们发现，为了实现事件委托相关操作，我们经常要书写重复的代码，为了降低代码的重复率，我们想到了使用ES6里的Proxy和Reflect对事件回调进行代理，在这过程中执行事件委托相关操作。

​	在 proxy.js 源码中，定义了事件委托处理的方法：_delegateEvent，以及事件委托Proxy生成器：delegateProxyCreator，这样在执行事件监听回调时，经过我们的事件委托Proxy，进行相应的事件委托处理，这样不仅可以大大减少代码重复率，使代码看起来更加精简美观，同时这样定位问题 bug 也变得简单很多，只需要从根源处去定位 bug 即可。

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



