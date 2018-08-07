const mtEvents = require('../core/index.js')
const touch = require('../core/touch.js')

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

describe('test DIY event longtap', () => {
	test("test bind('#bindTarget', 'longtap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'longtap', e => {
			bindTarget.innerHTML = 'longtap'
		})
		await delay4Longtap('#bindTarget', 500)
		expect(bindTarget.innerHTML).toBe("")
		await delay4Longtap(bindTarget, 1200)
		expect(bindTarget.innerHTML).toBe("longtap")
	})
	test("test bind('#bindTarget', 'longtap', [longtapHandler, shorttapHandler])", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'longtap', [e => {
			bindTarget.innerHTML = 'longtap'
		}, e => {
			bindTarget.innerHTML = 'shorttap'
		}])
		await delay4Longtap('#bindTarget', 500)
		expect(bindTarget.innerHTML).toBe("shorttap")
		await delay4Longtap(bindTarget, 1200)
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
		await delay4Longtap('#bindTarget', 500)
		expect(output.innerHTML).toBe("")
		await delay4Longtap(bindTarget, 1200)
		expect(output.innerHTML).toBe("")
		await delay4Longtap(delegateParent, 500)
		expect(output.innerHTML).toBe("")
		await delay4Longtap(delegateParent, 1200)
		expect(output.innerHTML).toBe("")
	})
	test("test bind('#bindTarget', '#delegateTarget', 'longtap', handler) make difference", async () => {
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
		await delay4Longtap(delegateTarget, 500)
		expect(output.innerHTML).toBe("shorttap")
		await delay4Longtap(delegateTarget, 1200)
		expect(output.innerHTML).toBe("longtap")
		await delay4Longtap(delegateChild, 500)
		expect(output.innerHTML).toBe("shorttap")
		await delay4Longtap(delegateChild, 1200)
		expect(output.innerHTML).toBe("longtap")
	})
})

describe('remove DIY longtap event', () => {
	test("test remove('#bindTarget', 'longtap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const longtapHandler = e => {
			bindTarget.innerHTML = 'longtap'
		}
		mtEvents(bindTarget, 'longtap', longtapHandler)
		mtEvents.remove(bindTarget, 'longtap', longtapHandler)
		await delay4Longtap(bindTarget, 1200)
		expect(bindTarget.innerHTML).toBe("")
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

describe('remove DIY dbtap event', () => {
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
	test("test remove('#bindTarget', 'dbtap', handler)", async () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		const dbtapHandler = e => {
			bindTarget.innerHTML = 'dbtap'
		}
		mtEvents(bindTarget, 'dbtap', dbtapHandler)
		mtEvents.remove(bindTarget, 'dbtap', dbtapHandler)
		await delay4Longtap('#bindTarget', 100)
		await delay4Longtap('#bindTarget', 100)
		expect(bindTarget.innerHTML).toBe("")
	})
})