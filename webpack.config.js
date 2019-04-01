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
    mode: 'development',
    // cache: false,
    plugins: [
        
        new webpack.DefinePlugin({
            __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true'))
        }),
        

        new HtmlWebpackPlugin(
            {
                template: './src/template.html',
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

        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'assets/**/*'),
                to: path.resolve(__dirname, 'dist')
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/sw.js'),
                to: path.resolve(__dirname, 'dist')
            }
        ]),
        new CopyWebpackPlugin([
            {
                from: path.resolve(__dirname, 'src/manifest.json'),
                to: path.resolve(__dirname, 'dist')
            }
        ]),

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
    },
    externals: {
        "oimo": true,
        "cannon": true,
        "earcut": true
    },
};
