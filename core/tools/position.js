class Position {
	constructor() {
		this.lastClientObjs = []
	}
	initLastClientObjs(lastClientObjs) {
		this.lastClientObjs = Object.assign([], lastClientObjs)
	}
	getDisplacement(thisClientObjs) {
		Object.keys(thisClientObjs)
	}
}

module.exports = Position