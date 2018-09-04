module.exports = {
	module: {
		rules: [{
			test: /(\.jsx|\.js)$/,
			use: {
				loader: 'babel-loader'
			},
			exclude: /node_modules/
		}]
	}
}