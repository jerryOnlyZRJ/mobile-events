# mt-events

Make mobile events user-friendly.

## Feature

* Use our function mtEvents in the Browser directly.
* Contains popular mobile terminal events like double tap(dbtap), long tap(longtap), you can listen then like native API addEventListener with our mtEvents.
* Contain event delegation, what you need to do is push an argument.
* MtEvents is compatible with native events.(Like click, touchEvents)

## Usage

### Using URL 

Include the (minified) **mtevents.min.js**  script file in your HTML markup: 

```html
<script src="dist/mtevents.min.js"></script>
```

In your application code, use function mtEvents directly:

```js
mtEvents('#bindTarget', 'click', e => console.log('click'))
```

### Using npm 

The following is an example how to use the mtEvents like a node.js module:（Like inside a VUE file）

Install the **mt-events** package with [npm](https://www.npmjs.org/): 

```shell
npm i mt-events
```

Require and use it like in the Browser condition:

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

## Tests

The JavaScript MD5 project comes with Unit Tests. 

You can run the test with npm test script in the Terminal n the root path of the repository package :

```shell
npm t
```

You can see there is a coverage file in the test folder.

## DOCS

If you want to make some contribution and know  how the function run works, you can run the command:

```shell
npm run docs
```

There will be a docs folder in the root path and you will see the API documentation,.