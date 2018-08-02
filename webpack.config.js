module.exports = {
  mode: "production",
  entry: './core/index-Browser.js',
  output: {
    filename: "mtevents.min.js"
  },
  resolve: {
    extensions: [".js"],
  }
}