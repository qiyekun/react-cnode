const path = require('path')
const HTMLPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const webpackBase = require('./webpack.base')
const webpackMerge = require('webpack-merge')

const cdnConfig = require('../app.config').cdn //eslint-disable-line

const isDev = process.env.NODE_ENV === 'development'

const config = webpackMerge(webpackBase, {
  entry: {
    app: path.join(__dirname, '../client/app.js')
  },
  output: {
    filename: '[name].[hash].js'
  },
  plugins: [
    new HTMLPlugin({
      template: path.join(__dirname, '../client/template.html')
    }),
    new HTMLPlugin({
      template: '!!ejs-compiled-loader!' + path.join(__dirname, '../client/server.template.ejs'),
      filename: 'server.ejs'
    })
  ]
})

if (isDev) {
  config.mode = 'development' // development | production
  config.devtool = '#cheap-module-eval-source-map'
  config.entry = {
    app: ['react-hot-loader/patch', path.join(__dirname, '../client/app.js')]
  }

  config.devServer = {
    host: '0.0.0.0',
    port: '8888',
    // contentBase: path.join(__dirname, '../dist'),
    hot: true,
    overlay: {
      errors: true
    },
    publicPath: '/public',
    historyApiFallback: {
      index: '/public/index.html'
    },
    proxy: {
      '/api': 'http://localhost:3333'
    }
  }

  config.plugins.push(new webpack.HotModuleReplacementPlugin())
} else {
  config.mode = 'production'
  config.entry = {
    app: path.join(__dirname, '../client/app.js')
  }
  config.output.publicPath = cdnConfig.host
  config.optimization = {
    splitChunks: {
      cacheGroups: {
        commons: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all'
        }
      }
    }
  }
}

module.exports = config; //eslint-disable-line
