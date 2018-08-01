module.exports = {
  mode: "production",
  entry: './core/index.js',
  output: {
    filename: "mtevents.min.js"
  },
  resolve: {
    extensions: [".js"],
  }
}