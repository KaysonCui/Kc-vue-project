const webpack = require('webpack')
const cssnano = require('cssnano')
const pxtorem = require('postcss-pxtorem')
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const config = require('../config')
const debug = require('debug')('app:webpack:config')
const paths = config.utils_paths
const __DEV__ = config.globals.__DEV__
const __PROD__ = config.globals.__PROD__
const __TEST__ = config.globals.__TEST__
debug('Creating configuration.')
const webpackConfig = {
    name: 'client',
    target: 'web',
    devtool: config.compiler_devtool,
    resolve: {
      root: paths.client(),
      extensions: ['', '.js', '.vue', '.json']
    },
    module: {}
  }
  // ------------------------------------
  // Entry Points
  // ------------------------------------
const APP_ENTRY = paths.client('main.js')
webpackConfig.entry = {
    app: __DEV__ ? [APP_ENTRY].concat(`webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`) : [APP_ENTRY],
    vendor: config.compiler_vendors
  }
  // ------------------------------------
  // Bundle Output
  // ------------------------------------
webpackConfig.output = {
    filename: `[name].[${config.compiler_hash_type}].js`,
    path: paths.tmp(),
    publicPath: config.compiler_public_path
  }
  // ------------------------------------
  // Plugins
  // ------------------------------------
webpackConfig.plugins = [
  new webpack.DefinePlugin(config.globals),
  new HtmlWebpackPlugin({
    template: paths.client('index.html'),
    hash: false,
    favicon: paths.client('static/favicon.ico'),
    filename: 'index.html',
    inject: 'body',
    minify: {
      collapseWhitespace: true
    },
    globals: config.globals
  })
]
if(__DEV__) {
  debug('Enable plugins for live development (HMR, NoErrors).')
  webpackConfig.plugins.push(new webpack.HotModuleReplacementPlugin(), new webpack.NoErrorsPlugin())
} else if(__PROD__ || __TEST__) {
  debug('Enable plugins for production (OccurenceOrder, Dedupe & UglifyJS).')
  webpackConfig.plugins.push(new webpack.optimize.OccurrenceOrderPlugin(), new webpack.optimize.DedupePlugin())
  if(__PROD__) {
    webpackConfig.plugins.push(new webpack.optimize.CommonsChunkPlugin({
        name: ['vendor'],
        minChunks: function(module, count) {
          // any required modules inside node_modules are extracted to vendor
          return(module.resource && /\.js$/.test(module.resource) && module.resource.indexOf(path.join(__dirname, '../node_modules')) === 0)
        }
      }),
      // extract webpack runtime and module manifest to its own file in order to
      // prevent vendor hash from being updated whenever app bundle is updated
      // new webpack.optimize.CommonsChunkPlugin({
      //   name: 'manifest',
      //   chunks: ['vendor']
      // }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      }), new ExtractTextPlugin(`[name].[${config.compiler_hash_type}].css`, {
        allChunks: true
      }))
  }
}
// ------------------------------------
// Loaders
// ------------------------------------
// File loaders
// JavaScript / JSON
webpackConfig.module.loaders = [{
  test: /\.vue$/,
  loader: 'vue'
}, {
  test: /\.js$/,
  loader: 'babel',
  exclude: /node_modules/
}, {
  test: /\.json$/,
  loader: 'json'
}, {
  test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
  loader: 'url',
  query: {
    limit: 10240,
    name: `[name].[hash].[ext]`
  }
}, {
  test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
  loader: 'url',
  query: {
    limit: 10240,
    name: `[name].[hash].[ext]`
  }
}]

function loaderAnalysis(loaders) {
  if(__PROD__) {
    return ExtractTextPlugin.extract(loaders.shift(), loaders.join('!'))
  }
  return loaders.join('!')
}
webpackConfig.module.loaders.push({
  test: /\.less$/,
  exclude: null,
  loader: loaderAnalysis(['style-loader', 'css-loader', 'postcss-loader', 'less-loader'])
})
webpackConfig.module.loaders.push({
  test: /\.css$/,
  exclude: null,
  loader: loaderAnalysis(['style-loader', 'css-loader', 'postcss-loader'])
})
webpackConfig.postcss = [
    cssnano({
      autoprefixer: {
        add: true,
        browsers: ['iOS >= 7', 'Android >= 4.1']
      },
      discardComments: {
        removeAll: true
      },
      discardUnused: false,
      mergeIdents: false,
      reduceIdents: false,
      safe: true,
      sourcemap: true
    }),
    pxtorem({
      rootValue: 50,
      propWhiteList: []
    })
  ]
  // ------------------------------------
  // Style Loaders
  // ------------------------------------
  // We use cssnano with the postcss loader, so we tell
  // css-loader not to duplicate minimization.
webpackConfig.vue = {
    loaders: {
      'css': loaderAnalysis(['vue-style-loader', 'css-loader', 'postcss-loader']),
      'less': loaderAnalysis(['vue-style-loader', 'css-loader', 'postcss-loader', 'less-loader'])
    }
  }
  /* eslint-disable */
  /* eslint-enable */
  // ------------------------------------
  // Finalize Configuration
  // ------------------------------------
const vuxLoader = require('vux-loader')
module.exports = vuxLoader.merge(webpackConfig, {
  options: {},
  plugins: [{
    name: 'vux-ui'
  }]
})