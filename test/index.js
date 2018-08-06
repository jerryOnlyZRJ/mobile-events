const mtEvents = require('../lib/index-npm.js')
const touch = require('../lib/touch.js')

describe('test MTEvents.bind', () => {
	test("bind(node, 'click', handler) —— 原生事件绑定", () => {
		document.body.innerHTML = '<div id="bindTarget"></div>'
		const bindTarget = document.querySelector('#bindTarget')
		mtEvents(bindTarget, 'click', e => {
			bindTarget.innerHTML = "click"
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
})