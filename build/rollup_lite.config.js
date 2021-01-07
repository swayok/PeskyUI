'use strict'

const path = require('path')
const babel = require('rollup-plugin-babel')
const resolve = require('@rollup/plugin-node-resolve')
const commonjs = require('@rollup/plugin-commonjs')
const peskyUIBanner = require('./peskyui-banner.js')
const babelHelpers = require('./babel-helpers.js')

const BUNDLE  = process.env.BUNDLE === 'true'

let fileDest = 'pesky-ui.js'
const externalForApp = ['jquery', 'popper.js']
const plugins = [
    babel({
        // Only transpile our source code
        exclude: 'node_modules/**',
        // Include only required helpers
        externalHelpersWhitelist: babelHelpers
    }),
    commonjs()
]
const globalsForApp = {
    jquery: 'jQuery', // Ensure we use jQuery which is always available even in noConflict mode
    'popper.js': 'Popper'
}

module.exports = [
    {
        input: path.resolve(__dirname, '../src/js/peskyui_index.js'),
        output: {
            banner: peskyUIBanner(),
            file: path.resolve(__dirname, `../dist/js/${fileDest}`),
            format: 'umd',
            globals: globalsForApp,
            name: 'pesky-ui'
        },
        external: externalForApp,
        plugins
    }
]
