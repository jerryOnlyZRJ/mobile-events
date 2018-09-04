const merge = require('webpack-merge')
const argv = require('yargs-parser')(process.argv.slice(2))
let ltsWebpackConfig = {}

const commonWebpackConfig = {
	mode: "production",
	entry: './lib/index-Browser.js',
	output: {
		filename: "mtevents.min.js"
	}
}

if (argv.type === 'lts') {
	ltsWebpackConfig = require('./webpack.lts.config.js')
	commonWebpackConfig.output.filename = 'mtevents-lts.min.js'
}

module.exports = merge(commonWebpackConfig, ltsWebpackConfig)