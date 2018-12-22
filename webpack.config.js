const path = require('path');
const webpack = require('webpack');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

module.exports = {
    entry: './src/main.js',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    watch: true,
    mode: 'production',
    plugins: [

        // // webpack.optimize.CommonsChunkPlugin has been removed, please use config.optimization.splitChunks instead.
        // new webpack.optimize.CommonsChunkPlugin({
        //     name: 'vendor',
        //     filename: 'vendor.bundle.js'
        // }),

        new HtmlWebpackPlugin(
            {
                // filename: '../index.html',
                template: './src/template.html',
                chunks: ['vendor', 'bundle'],
                chunksSortMode: 'manual',
                minify: {
                    removeAttributeQuotes: false,
                    collapseWhitespace: false,
                    html5: false,
                    minifyCSS: false,
                    minifyJS: false,
                    minifyURLs: false,
                    removeComments: false,
                    removeEmptyAttributes: false
                },
                hash: false
            }
        ),

        // new CopyWebpackPlugin([
        //     {
        //         from: path.resolve(__dirname, 'assets/**/*'),
        //         to: path.resolve(__dirname, 'dist')
        //     }
        // ]),

        new BrowserSyncPlugin({
            host: process.env.IP || 'localhost',
            port: process.env.PORT || 3000,
            files: [{
                match: ['./src/**/*'],
                fn: function (event, file) {
                    this.reload()
                }
            }],
            // files: ['./src/*'],
            server: {
                baseDir: ['./dist']
            }
        })
    ],
    module: {
        rules: [
            { test: /\.js$/, use: ['babel-loader'], include: path.join(__dirname, 'src') },
        ]
    }
};
