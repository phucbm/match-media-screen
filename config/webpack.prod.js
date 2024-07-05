const TerserPlugin = require('terser-webpack-plugin');
const webpack = require('webpack');
const {paths, packageInfo, bannerConfig, env} = require('./config');
const path = require("path");

/**
 * ...
 * Rest of your existing config code here
 * ...
 */

// Define base configuration for match-media-screen.js and match-media-screen.min.js
const matchMediaScreenConfigBase = {
    mode: 'production',
    devtool: false,
    entry: path.resolve(__dirname, '../dist/src/_index.js'),
    output: {
        libraryTarget: "umd",
        umdNamedDefine: true,
        globalObject: 'this',
    },
    plugins: [
        new webpack.BannerPlugin(bannerConfig)
    ],
};

// Configuration for match-media-screen.js
const matchMediaScreenConfig = Object.assign({}, matchMediaScreenConfigBase, {
    output: {
        ...matchMediaScreenConfigBase.output,
        filename: 'match-media-screen.js',
    },
});

// Configuration for match-media-screen.min.js
const matchMediaScreenMinConfig = Object.assign({}, matchMediaScreenConfigBase, {
    output: {
        ...matchMediaScreenConfigBase.output,
        filename: 'match-media-screen.min.js',
    },
    optimization: {
        minimizer: [new TerserPlugin({extractComments: false})],
    },
});

module.exports = [
    // your existing configuration here...

    matchMediaScreenConfig, matchMediaScreenMinConfig
];
