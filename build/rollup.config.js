'use strict'

const path = require('path')
const babel = require('rollup-plugin-babel')
const resolve = require('@rollup/plugin-node-resolve')
const bootstrapBanner = require('./banner.js')
const peskyUIBanner = require('./peskyui-banner.js')
const babelHelpers = require('./babel-helpers.js')

const BUNDLE  = process.env.BUNDLE === 'true'

let fileDest = 'pesky-ui.js'
let libsDest = 'pesky-ui-libs.js'
const external = ['jquery', 'popper.js']
const externalForApp = ['jquery', 'popper.js']
const plugins = [
    babel({
        // Only transpile our source code
        exclude: 'node_modules/**',
        // Include only required helpers
        externalHelpersWhitelist: babelHelpers
    })
]
const globals = {
    jquery: 'jQuery', // Ensure we use jQuery which is always available even in noConflict mode
    'popper.js': 'Popper'
}

if (BUNDLE) {
    libsDest = 'pesky-ui-libs.bundle.js'
    fileDest = 'pesky-ui.bundle.js'
    // Remove last entry in external array to bundle Popper
    external.pop()
    delete globals['popper.js']
    plugins.push(resolve())
}

module.exports = [
    {
        input: path.resolve(__dirname, '../src/js/libs_index.js'),
        output: {
            banner: bootstrapBanner(),
            file: path.resolve(__dirname, `../dist/js/${libsDest}`),
            format: 'umd',
            globals,
            name: 'libs'
        },
        external,
        plugins
    },
    {
        input: path.resolve(__dirname, '../src/js/peskyui_index.js'),
        output: {
            banner: peskyUIBanner(),
            file: path.resolve(__dirname, `../dist/js/${fileDest}`),
            format: 'umd',
            globals,
            name: 'pesky-ui'
        },
        external: externalForApp,
        plugins
    }
]
