const replace = require('rollup-plugin-replace')
const argv = require('yargs-parser')(process.argv.slice(2));
const platform = argv.platform

export default {
  input: './core/index.js',
  output: {
    file: `core/index-${platform}.js`,
    format: 'cjs'
  },
  plugins: [
    replace({
      "process.env.PLATFORM": JSON.stringify(platform)
    })
  ]
};