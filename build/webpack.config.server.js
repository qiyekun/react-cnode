const path = require('path')
const webpack = require('webpack')
const webpackBase = require('./webpack.base')
const webpackMerge = require('webpack-merge')

const config = webpackMerge(webpackBase, {
  target: 'node',
  entry: {
    app: path.join(__dirname, '../client/server.entry.js')
  },
  externals: Object.keys(require('../package.json').dependencies),
  output: {
    filename: 'server.entry.js',
    libraryTarget: 'commonjs2'
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.API_BASE': '"http://127.0.0.1:3333"'
    })
  ]
})

const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  config.mode = 'development'
}

module.exports = config;//eslint-disable-line
