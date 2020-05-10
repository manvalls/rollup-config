import babel from 'rollup-plugin-babel'
import gzip from 'rollup-plugin-gzip'
import { terser } from 'rollup-plugin-terser'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

import babelPresetEnv from '@babel/preset-env'
import babelPluginClassProps from '@babel/plugin-proposal-class-properties'
import babelPluginForOf from '@babel/plugin-transform-for-of'

export default ({ external = [], name, globals } = {}) => {
  const input = 'src/index.js'
  let output, plugins
  const babelPlugins = [
    babel({
      babelrc: false,
      exclude: 'node_modules/**',
      presets: [
        [babelPresetEnv, { loose: true }]
      ],
      plugins: [
        [babelPluginClassProps, { loose: true }],
        [babelPluginForOf, { assumeArray: true }],
      ],
    }),
  ]

  const esResolveOptions = {
    mainFields: ['es', 'module', 'main'],
  }

  const minPlugins = (es) => [
    commonjs(),
    es ? resolve(esResolveOptions) : resolve(),
    terser(),
    gzip()
  ]

  function filterExternal() {
    if (!globals) {
      external = []
    } else {
      external = external.filter((e) => globals.hasOwnProperty(e))
    }
  }
  
  switch (process.env.TARGET) {
    case 'esm':
      output = {
        file: `dist/${name}.esm.js`,
        format: 'esm',
      }

      plugins = babelPlugins
      break

    case 'cjs':
      output = {
        file: `dist/${name}.cjs.js`,
        format: 'cjs',
      }

      plugins = babelPlugins
      break

    case 'es':
      output = {
        file: `dist/${name}.es.js`,
        format: 'esm',
      }

      plugins = []
      break

    case 'min':
      output = {
        file: `dist/${name}.min.js`,
        format: 'iife',
        name,
        globals,
      }

      plugins = [
        ...babelPlugins,
        ...minPlugins(),
      ]

      filterExternal()

      break

    case 'es.min':
      output = {
        file: `dist/${name}.es.min.js`,
        format: 'iife',
        name,
        globals,
      }

      plugins = minPlugins(true)

      filterExternal()

      break
  }

  return { external, input, output, plugins }
}