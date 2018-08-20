module.exports = {
	mode: "production",
	entry: './lib/index-Browser.js',
	optimization: {
		concatenateModules: true
	},
	output: {
		filename: "mtevents.min.js"
	}
}