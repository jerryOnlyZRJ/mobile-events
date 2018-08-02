module.exports = {
  mode: "production",
  entry: './lib/index-Browser.js',
  output: {
    filename: "mtevents.min.js"
  },
  resolve: {
    extensions: [".js"],
  }
}