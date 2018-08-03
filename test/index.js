const mtEvents = require('../lib/index-npm.js')

describe('test MTEvents.bind', () => {
  test("bind('#bindTarget', 'click', handler) —— 原生事件绑定", () => {
    document.body.innerHTML = '<div id="bindTarget"></div>'
    const bindTarget = document.querySelector('#bindTarget')
    mtEvents(bindTarget, 'click', e => {
      bindTarget.innerHTML = "click"
    })
    bindTarget.click()
    expect(bindTarget.innerHTML).toBe("click")
  })
})