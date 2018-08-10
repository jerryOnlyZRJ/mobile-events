function weakMapCreator (htmlElement, callback) {
  let weakMap = new WeakMap()
  weakMap.set(htmlElement, callback)
  return weakMap
}

module.exports = weakMapCreator
