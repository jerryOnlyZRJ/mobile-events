const rollup = require('rollup')
const buble = require('rollup-plugin-buble')
const uglify = require('uglify-js')
const gzipSize = require('gzip-size')
const fs = require('fs')
const path = require('path')
const pkg = require('../package.json')
const cwd = process.cwd()
const ENV_RE = /process\.env\.ENV/g
const jsDocRegExp = /\/\*\*([\w\W]*?)\*\//g

const comment = `/**
 * mtEvents v${pkg.version}
 * Copyright 2018-2019 Ranjay
 * Released under the MIT License
 * https://github.com/jerryOnlyZRJ/mobile-events
 */\r\n`

const options = {
  format: 'iife',
  name: 'mtevents'
}

async function build () {
  const bundle = await rollup.rollup({
    input: path.join(cwd, 'core/index.js'),
    plugins: [
      buble()
    ]
  })

  let {
    code
  } = await bundle.generate(options)

  // remove jsdoc
  code = code.replace(jsDocRegExp, '')

  code = fs.readFileSync(path.join(cwd, 'build/wrapper.js')).toString().replace('INSERT', code.split('\n').slice(1, -3).join('\n')).replace("'use strict'", '"use strict"')
  const developmentCode = comment + code.replace(ENV_RE, '"development"')
  const productionCode = comment + uglify.minify(code.replace(ENV_RE, '"production"')).code

  fs.writeFileSync(path.join(cwd, 'dist/mtevents.js'), developmentCode)
  fs.writeFileSync(path.join(cwd, 'dist/mtevents.min.js'), productionCode)

  console.log('mtevents development -> ' + developmentCode.length / 1000 + 'kb')
  console.log('mtevents production -> ' + productionCode.length / 1000 + 'kb')
  console.log('')
  console.log('mtevents development (gzipped) -> ' + gzipSize.sync(developmentCode) / 1000 + 'kb')
  console.log('mtevents production (gzipped) -> ' + gzipSize.sync(productionCode) / 1000 + 'kb')
}

build()
