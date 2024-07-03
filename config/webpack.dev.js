const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const {paths, packageInfo, server, env} = require('./config');

const port = env.PORT || '8080';
const entryFolder = env.ENTRY || 'dev';
const entryPath = path.resolve(__dirname, `../${entryFolder}`);

const devConfig = merge(server, {
    mode: 'development',

    entry: [`${entryPath}/script.ts`],

    output: {
        path: paths.dist,
        filename: '[name].bundle.js',
        publicPath: '/',
    },

    plugins: [
        new CleanWebpackPlugin(),

        new CopyWebpackPlugin({
            patterns: [
                {
                    from: paths.public,
                    to: 'assets',
                    globOptions: {
                        ignore: ['*.DS_Store'],
                    },
                    noErrorOnMissing: true,
                },
            ],
        }),

        new HtmlWebpackPlugin({
            inject: true,
            hash: true,
            title: packageInfo.prettyName,
            favicon: `${paths.public}/images/favicon.png`,
            template: `${entryPath}/index.html`,
            filename: 'index.html',
        }),
    ],

    devServer: {
        historyApiFallback: true,
        open: true,
        compress: true,
        hot: true,
        port: parseInt(port, 10),
    },
});

module.exports = devConfig;
