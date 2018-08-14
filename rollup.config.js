const replace = require('rollup-plugin-replace')
const argv = require('yargs-parser')(process.argv.slice(2));
const copy = require('rollup-plugin-copy')
const platform = argv.platform

export default {
  entry: './core/index.js',
  output: {
    file: `lib/index-${platform}.js`,
    format: 'cjs'
  },
  plugins: [
    replace({
      "process.env.PLATFORM": JSON.stringify(platform)
    }),
    copy({
      './core/events.js': 'lib/events.js',
      './core/proxy.js': 'lib/proxy.js',
      './core/weakmap.js': 'lib/weakmap.js',
      './core/singleevent.js': 'lib/singleevent.js',
    })
  ]
};