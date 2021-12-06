import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'lib/index.js',
  output: {
    file: 'dist/index.js',
    format: 'umd',
    name: 'quickjsEval',
  },
  plugins: [
    commonjs(),
  ]
}
