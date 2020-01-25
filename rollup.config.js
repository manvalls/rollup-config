import config from '.'

export default config({
  name: 'rollupConfig',
  external: [
    'rollup-plugin-babel',
    'rollup-plugin-gzip',
    'rollup-plugin-terser',
    'rollup-plugin-node-resolve',
    'rollup-plugin-commonjs',
    '@babel/preset-env',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-transform-for-of',
  ],
})