const mtEvents = require('../lib/index-npm.js')
const touch = require('./tools/touch.js')

function delay4tap(bindTarget, clientX, clientY, delay) {
	return new Promise((resolve, reject) => {
		const touchstart = touch.createTouchEvent('touchstart')
		touchstart.touches = [];
		touchstart.touches.push({
			'clientX': clientX,
			'clientY': clientY
		})
		const touchend = touch.createTouchEvent('touchend')
		touchend.changedTouches = [];
		touchend.changedTouches.push({
			'clientX': 100,
			'clientY': 100
		})
		touch.dispatchTouchEvent(bindTarget, touchstart)
		setTimeout(() => {
			touch.dispatchTouchEvent(bindTarget, touchend)
			resolve()
		}, delay)
	})
}

function delay4Longtap(bindTarget, delay) {
	return new Promise((resolve, reject) => {
		const touchstart = touch.createTouchEvent('touchstart')
		const touchend = touch.createTouchEvent('touchend')
		touch.dispatchTouchEvent(bindTarget, touchstart)
		setTimeout(() => {
			touch.dispatchTouchEvent(bindTarget, touchend)
			resolve()
		}, delay)
	})
}

function swipeTouch(bindTarget, delay) {
	return new Promise((resolve, reject) => {
		const touchstart = touch.createTouchEvent('touchstart')
		touchstart.touches = [];
		touchstart.touches.push({
			'clientX': 100,
			'clientY': 100
		})
		touch.dispatchTouchEvent(bindTarget, touchstart)
		setTimeout(() => {
			const touchend = touch.createTouchEvent('touchend')
			touchend.changedTouches = [];
			touchend.changedTouches.push({
				'clientX': 300,
				'clientY': 300
			})
			touch.dispatchTouchEvent(bindTarget, touchend)
			resolve()
		}, delay)
	})
}

describe('test arguments validity', () => {
	test('test _checkBindTargetInput', () => {
		document.body.innerHTML = '<div id="test-element"></div>'
		try {
			mtEvents._checkBindTargetInput('nothing-could-be-choisen')
		} catch (err) {
			expect(err instanceof Error).toBeTruthy()
		}
	})
})
describe('test MTEvents.bind', () => {
	test("bind(node, 'click', handler) —— 原生事件绑定", () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'click', e => {
			bindTarget.innerHTML += "click"
		})
		bindTarget.click()
		expect(bindTarget.innerHTML).toBe("click")
	})
	test("bind(node, {'click': handler}) —— 原生事件绑定", () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, {
			click: e => {
				bindTarget.innerHTML = "click"
			}
		})
		bindTarget.click()
		expect(bindTarget.innerHTML).toBe("click")
	})
	test("bind('#bindTarget', 'click', handler) —— 原生事件绑定", () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents('#bindTarget', 'click', e => {
			bindTarget.innerHTML = "click"
		})
		bindTarget.click()
		expect(bindTarget.innerHTML).toBe("click")
	})
})

describe('test remove native event', () => {
	test("test remove('#bindTarget', 'click', handler)", () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const clickHandler = e => bindTarget.innerHTML += "click"
		mtEvents('#bindTarget', 'click', clickHandler)
		mtEvents.remove(bindTarget, 'click', clickHandler)
		bindTarget.click()
		expect(bindTarget.innerHTML).toBe("")
	})
	test("test remove('#bindTarget', {'click': handler})", () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const clickHandler = e => bindTarget.innerHTML += "click"
		mtEvents('#bindTarget', {
			click: clickHandler
		})
		mtEvents.remove(bindTarget, {
			click: clickHandler
		})
		bindTarget.click()
		expect(bindTarget.innerHTML).toBe("")
	})
})

describe('test delegate event', () => {
	test("bind('#bindTarget', '#delegateTarget', 'click', handler)", () => {
		document.body.innerHTML = '<div id="bindTarget"><div id="delegateParent"><div id="delegateTarget"><div id="delegateChild"></div></div></div></div><div id="output"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const delegateParent = document.querySelector('#delegateParent')
		const delegateTarget = document.querySelector('#delegateTarget')
		const delegateChild = document.querySelector('#delegateChild')
		const output = document.querySelector('#output')
		mtEvents(bindTarget, '#delegateTarget', 'click', e => {
			output.innerHTML = "delegateTarget click"
		})
		bindTarget.click()
		expect(output.innerHTML).toBe("")
		delegateParent.click()
		expect(output.innerHTML).toBe("")
		delegateTarget.click()
		expect(output.innerHTML).toBe("delegateTarget click")
		output.innerHTML = ""
		delegateChild.click()
		expect(output.innerHTML).toBe("delegateTarget click")
	})
	test("bind('#bindTarget', '#delegateTarget', {'click': handler})", () => {
		document.body.innerHTML = '<div id="bindTarget"><div id="delegateParent"><div id="delegateTarget"><div id="delegateChild"></div></div></div></div><div id="output"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const delegateParent = document.querySelector('#delegateParent')
		const delegateTarget = document.querySelector('#delegateTarget')
		const delegateChild = document.querySelector('#delegateChild')
		const output = document.querySelector('#output')
		mtEvents(bindTarget, '#delegateTarget', {
			click: e => {
				output.innerHTML = "delegateTarget click"
			}
		})
		bindTarget.click()
		expect(output.innerHTML).toBe("")
		delegateParent.click()
		expect(output.innerHTML).toBe("")
		delegateTarget.click()
		expect(output.innerHTML).toBe("delegateTarget click")
		output.innerHTML = ""
		delegateChild.click()
		expect(output.innerHTML).toBe("delegateTarget click")
	})
})

describe('test DIY event tap', () => {
	test("test bind('#bindTarget', 'tap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'tap', e => {
			bindTarget.innerHTML = 'tap'
		})
		await delay4tap('#bindTarget', 60, 60, 100)
		expect(bindTarget.innerHTML).toBe("tap")
	})
	test("test bind('#bindTarget', 'tap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'tap', e => {
			bindTarget.innerHTML = 'tap'
		})
		await delay4tap('#bindTarget', 10, 10, 100)
		expect(bindTarget.innerHTML).toBe("")
	})
	test("test bind('#bindTarget', 'tap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'tap', e => {
			bindTarget.innerHTML = 'tap'
		})
		await delay4tap('#bindTarget', 60, 60, 1200)
		expect(bindTarget.innerHTML).toBe("")
	})
	test("test bind('#bindTarget', '#delegateTarget', 'tap', handler) make difference", async () => {
		document.body.innerHTML = '<div id="bindTarget"><div id="delegateParent"><div id="delegateTarget"><div id="delegateChild"></div></div></div></div><div id="output"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const output = document.querySelector('#output')
		mtEvents(bindTarget, "#delegateTarget", 'tap', e => {
			output.innerHTML = 'tap'
		})
		await delay4tap('#bindTarget', 60, 60, 100)
		expect(output.innerHTML).toBe("")
		await delay4tap('#delegateParent', 60, 60, 100)
		expect(output.innerHTML).toBe("")
		await delay4tap('#delegateTarget', 60, 60, 100)
		expect(output.innerHTML).toBe("tap")
		await delay4tap('#delegateChild', 60, 60, 100)
		expect(output.innerHTML).toBe("tap")
	})
})

describe('remove DIY tap event', () => {
	test("test remove('#bindTarget', 'tap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const dbtapHandler = e => {
			bindTarget.innerHTML = 'tap'
		}
		mtEvents(bindTarget, 'tap', dbtapHandler)
		mtEvents.remove(bindTarget, 'tap', dbtapHandler)
		await delay4tap('#bindTarget', 100)
		expect(bindTarget.innerHTML).toBe("")
	})
})

describe('test DIY event longtap', () => {
	test("test bind('#bindTarget', 'longtap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'longtap', e => {
			bindTarget.innerHTML = 'longtap'
		})
		await delay4tap('#bindTarget', 50, 50, 500)
		expect(bindTarget.innerHTML).toBe("")
		await delay4tap('#bindTarget', 300, 300, 1200)
		expect(bindTarget.innerHTML).toBe("")
		await delay4tap(bindTarget, 50, 50, 1200)
		expect(bindTarget.innerHTML).toBe("longtap")
	})
	test("test bind('#bindTarget', '#delegateTarget', 'longtap', handler) nothing done", async () => {
		document.body.innerHTML = '<div id="bindTarget"><div id="delegateParent"><div id="delegateTarget"><div id="delegateChild"></div></div></div></div><div id="output"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const delegateParent = document.querySelector('#delegateParent')
		const delegateTarget = document.querySelector('#delegateTarget')
		const delegateChild = document.querySelector('#delegateChild')
		const output = document.querySelector('#output')
		mtEvents(bindTarget, "#delegateTarget", 'longtap', [e => {
			output.innerHTML = 'longtap'
		}, e => {
			output.innerHTML = 'shorttap'
		}])
		await delay4tap('#bindTarget', 50, 50, 500)
		expect(output.innerHTML).toBe("")
		await delay4tap(bindTarget, 50, 50, 1200)
		expect(output.innerHTML).toBe("")
		await delay4tap(delegateParent, 50, 50, 500)
		expect(output.innerHTML).toBe("")
		await delay4tap(delegateParent, 50, 50, 1200)
		expect(output.innerHTML).toBe("")
	})
	test("test bind('#bindTarget', '#delegateTarget', 'longtap', handler) make difference", async () => {
		document.body.innerHTML = '<div id="bindTarget"><div id="delegateParent"><div id="delegateTarget"><div id="delegateChild"></div></div></div></div><div id="output"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const delegateParent = document.querySelector('#delegateParent')
		const delegateTarget = document.querySelector('#delegateTarget')
		const delegateChild = document.querySelector('#delegateChild')
		const output = document.querySelector('#output')
		mtEvents(bindTarget, "#delegateTarget", 'longtap', e => {
			output.innerHTML = 'longtap'
		})
		await delay4tap(delegateTarget, 50, 50, 1200)
		expect(output.innerHTML).toBe("longtap")
		await delay4tap(delegateChild, 50, 50, 1200)
		expect(output.innerHTML).toBe("longtap")
	})
})

describe('test DIY event dbtap', () => {
	function delay4Longtap(bindTarget, delay) {
		return new Promise((resolve, reject) => {
			const touchstart = touch.createTouchEvent('touchstart')
			const touchend = touch.createTouchEvent('touchend')
			touchend.changedTouches.push({
				'clientX': 446,
				'clientY': 368
			})
			touch.dispatchTouchEvent(bindTarget, touchstart)
			setTimeout(() => {
				touch.dispatchTouchEvent(bindTarget, touchend)
				resolve()
			}, delay)
		})
	}

	function delay4OtherLongtap(bindTarget, delay) {
		return new Promise((resolve, reject) => {
			const touchstart = touch.createTouchEvent('touchstart')
			const touchend = touch.createTouchEvent('touchend')
			touchend.changedTouches = [];
			touchend.changedTouches.push({
				'clientX': 200,
				'clientY': 100
			})
			touch.dispatchTouchEvent(bindTarget, touchstart)
			setTimeout(() => {
				touch.dispatchTouchEvent(bindTarget, touchend)
				resolve()
			}, delay)
		})
	}
	test("test bind('#bindTarget', 'dbtap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'dbtap', e => {
			bindTarget.innerHTML = 'dbtap'
		})
		await delay4Longtap('#bindTarget', 100)
		await delay4Longtap('#bindTarget', 100)
		expect(bindTarget.innerHTML).toBe("dbtap")
	})
	test("test bind('#bindTarget', 'dbtap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'dbtap', e => {
			bindTarget.innerHTML = 'dbtap'
		})
		await delay4Longtap('#bindTarget', 100)
		await delay4OtherLongtap('#bindTarget', 100)
		expect(bindTarget.innerHTML).toBe("")
	})
	test("test bind('#bindTarget', 'dbtap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'dbtap', e => {
			bindTarget.innerHTML = 'dbtap'
		})
		await delay4Longtap('#bindTarget', 100)
		setTimeout(() => {
			delay4OtherLongtap('#bindTarget', 100)
			expect(bindTarget.innerHTML).toBe("")
		}, 1200)
	})
	test("test bind('#bindTarget', '#delegateTarget', 'dbtap', handler) make difference", async () => {
		document.body.innerHTML = '<div id="bindTarget"><div id="delegateParent"><div id="delegateTarget"><div id="delegateChild"></div></div></div></div><div id="output"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const output = document.querySelector('#output')
		mtEvents(bindTarget, "#delegateTarget", 'dbtap', e => {
			output.innerHTML = 'dbtap'
		})
		await delay4Longtap('#bindTarget', 100)
		await delay4Longtap('#bindTarget', 100)
		expect(output.innerHTML).toBe("")
		await delay4Longtap('#delegateParent', 100)
		await delay4Longtap('#delegateParent', 100)
		expect(output.innerHTML).toBe("")
		await delay4Longtap('#delegateTarget', 100)
		await delay4Longtap('#delegateTarget', 100)
		expect(output.innerHTML).toBe("dbtap")
		await delay4Longtap('#delegateChild', 100)
		await delay4Longtap('#delegateChild', 100)
		expect(output.innerHTML).toBe("dbtap")
	})
})

describe('test DIY event swipe', () => {
	test("test bind('#bindTarget', 'swipe', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'swipe', e => {
			bindTarget.innerHTML = `swipe x:${e.displacement.x}, y:${e.displacement.y}`
		})
		await swipeTouch('#bindTarget', 50)
		expect(bindTarget.innerHTML).toBe("swipe x:200, y:200")
	})
})

describe('test DIY event drag', () => {
	test("test bind('#bindTarget', 'drag', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget-drag"></div>'
		const bindTarget = document.querySelector('#bindTarget-drag')
		mtEvents(bindTarget, 'drag', e => {
			bindTarget.innerHTML = `drag x:${e.displacement.x}, y:${e.displacement.y}`
		})
		const touchstart = touch.createTouchEvent('touchstart')
		touchstart.touches = [];
		touchstart.touches.push({
			'clientX': 100,
			'clientY': 100
		})
		touch.dispatchTouchEvent(bindTarget, touchstart)
		const touchmove = touch.createTouchEvent('touchmove')
		touchmove.touches = [];
		touchmove.touches.push({
			'clientX': 300,
			'clientY': 300
		})
		touch.dispatchTouchEvent(bindTarget, touchmove)
		expect(bindTarget.innerHTML).toBe("drag x:200, y:200")
	})
})

describe('test DIY event scale', () => {
	test("test bind('#bindTarget', 'scale', handler)", cb => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		let scale = 0
		mtEvents(bindTarget, 'scale', e => {
			expect(e.scale).toBe(2)
		})
		const touchmove = touch.createTouchEvent('touchmove')
		touchmove.touches = []
		touchmove.touches.push({
			clientX: 0,
			clientY: 0
		})
		touchmove.touches.push({
			clientX: 100,
			clientY: 100
		})
		touch.dispatchTouchEvent(bindTarget, touchmove)
		touchmove.touches.splice(0, 2)
		touchmove.touches.push({
			clientX: 0,
			clientY: 0
		})
		touchmove.touches.push({
			clientX: 200,
			clientY: 200
		})
		touch.dispatchTouchEvent(bindTarget, touchmove)
		setTimeout(() => {
			const touchend = touch.createTouchEvent('touchend')
			touch.dispatchTouchEvent(bindTarget, touchend)
			cb()
		}, 100)
	})
})

describe('test DIY event rotate', () => {
	test("test clockwise rotate", cb => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents('#bindTarget', 'rotate', e => {
			expect(e.rotate.direction).toBe("clockwise")
			expect(parseInt(e.rotate.rotateAngle)).toBe(45)
			expect(e.rotate.dirt).toBe(1)
			cb()
		})
		const touchmove = touch.createTouchEvent('touchmove')
		touchmove.touches = []
		touchmove.touches.push({
			clientX: 0,
			clientY: 100
		})
		touchmove.touches.push({
			clientX: 100,
			clientY: 100
		})
		touch.dispatchTouchEvent(bindTarget, touchmove)
		touchmove.touches.splice(0, 2)
		touchmove.touches.push({
			clientX: 0,
			clientY: 100
		})
		touchmove.touches.push({
			clientX: 100,
			clientY: 200
		})
		touch.dispatchTouchEvent(bindTarget, touchmove)
	})
	test("test anticlockwise rotate", cb => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents('#bindTarget', 'rotate', e => {
			expect(e.rotate.direction).toBe("anticlockwise")
			expect(parseInt(e.rotate.rotateAngle)).toBe(45)
			expect(e.rotate.dirt).toBe(0)
		})
		const touchmove = touch.createTouchEvent('touchmove')
		touchmove.touches = []
		touchmove.touches.push({
			clientX: 0,
			clientY: 100
		})
		touchmove.touches.push({
			clientX: 100,
			clientY: 100
		})
		touch.dispatchTouchEvent(bindTarget, touchmove)
		touchmove.touches.splice(0, 2)
		touchmove.touches.push({
			clientX: 0,
			clientY: 100
		})
		touchmove.touches.push({
			clientX: 100,
			clientY: 0
		})
		touch.dispatchTouchEvent(bindTarget, touchmove)
		setTimeout(() => {
			const touchend = touch.createTouchEvent('touchend')
			touch.dispatchTouchEvent(bindTarget, touchend)
			cb()
		}, 100)
	})
})