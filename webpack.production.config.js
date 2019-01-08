const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'deploy')
  },
  watch: false,
  mode: 'production',
  plugins: [

    // // webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
    // new webpack.optimize.CommonsChunkPlugin({
    //     name: 'vendor',
    //     filename: 'vendor.bundle.js'
    // }),

    new webpack.DefinePlugin({
      __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'false'))
    }),

    new HtmlWebpackPlugin(
      {
        // filename: '../index.html',
        template: './src/template.html',
        minify: {
          removeAttributeQuotes: false,
          collapseWhitespace: false,
          html5: false,
          minifyCSS: false,
          minifyJS: true,
          minifyURLs: false,
          removeComments: false,
          removeEmptyAttributes: false
        },
        hash: false
      }
    ),

    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'assets/**/*'),
        to: path.resolve(__dirname, 'deploy')
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/sw.js'),
        to: path.resolve(__dirname, 'deploy')
      }
    ]),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, 'src/manifest.json'),
        to: path.resolve(__dirname, 'deploy')
      }
    ])


  ],
  module: {
    rules: [
      { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
    ]
  },
  externals: {
    "oimo": true,
    "cannon": true,
    "earcut": true
  },
};
