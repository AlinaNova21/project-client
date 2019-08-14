import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import builtins from 'rollup-plugin-node-builtins'
import globals from 'rollup-plugin-node-globals'
import nodeResolve from 'rollup-plugin-node-resolve'
import replace from 'rollup-plugin-replace'

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/bundle.js',
    format: 'iife',
    name: 'client'
  },
  // external: ['pixi.js'],
  plugins: [
    builtins(),
    replace({
      include:
        'node_modules/@screeps/renderer-metadata/dist/renderer-metadata.js',
      values: {
        'window.': 'export const '
      }
    }),
    nodeResolve({
      jsnext: true,
      main: true,
      preferBuiltins: false
    }),
    commonjs({
      include: /node_modules/
    }),
    globals(),
    json({})
  ]
}
