const path = require('path');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const packageInfo = require('../package.json');

/**
 * Environment variables
 * scripts: cross-env NODE_ENV=development
 */
const env = process.env;

/**
 * Banner
 */
const bannerConfig = {
    banner: `
/**!
 * ${packageInfo.prettyName} v${packageInfo.version}
 * @author ${packageInfo.author.name}
 * @homepage ${packageInfo.homepage}
 * @license ${packageInfo.license} ${new Date().getFullYear()}
 */`,
    raw: true
};

/**
 * Paths
 */
const paths = {
    // Source files
    src: path.resolve(__dirname, '../src'),
    entry: path.resolve(__dirname, '../src/_index.ts'),

    // Production build files
    dist: path.resolve(__dirname, '../dist'),

    // Build web
    build: path.resolve(__dirname, '../build'),

    // Static files that get copied to build folder
    public: path.resolve(__dirname, '../public'),
};

/**
 * Server
 */
const server = {
    module: {
        rules: [
            // TypeScript: Use Babel to transpile TypeScript files
            {test: /\.ts$/, use: ['babel-loader']},

            // JavaScript: Use Babel to transpile JavaScript files
            {test: /\.js$/, use: ['babel-loader']},

            // Images: Copy image files to build folder
            {test: /\.(?:ico|gif|png|jpg|jpeg)$/i, type: 'asset/resource'},

            // Fonts and SVGs: Inline files
            {test: /\.(woff(2)?|eot|ttf|otf|svg|)$/, type: 'asset/inline'},

            // HTML
            {test: /\.html$/i, loader: "html-loader"},

            // Styles: Inject CSS into the head with source maps
            {
                test: /\.(sass|scss|css)$/,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {sourceMap: true, importLoaders: 1, modules: false},
                    },
                    {loader: 'postcss-loader', options: {sourceMap: true}},
                    {loader: 'sass-loader', options: {sourceMap: true}},
                ],
            },
        ],
    },

    resolve: {
        modules: [paths.src, 'node_modules'],
        extensions: ['.ts', '.js', '.json'],
        alias: {
            '@': paths.src,
            assets: paths.public,
        },
    },

    devtool: 'inline-source-map',
};

module.exports = {paths, packageInfo, bannerConfig, server, env};
