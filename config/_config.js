const webpack = require('webpack')
const Config = require('webpack-chain')

const config = new Config()
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const mock = require('../mock')

// eslint-disable-next-line global-require
const resolve = (path) => require('path').resolve(__dirname,path)
const devMode = process.env.NODE_ENV !== 'production';

config
    .mode('development')
    .entry('index')
        .add('../src/index.ts')
        .end()
    .output
        .path('dist')
        .filename('[name].[chunkhash].js')
        .publicPath('/')
        .chunkFilename('[name].[chunkhash:5].chunk.js')
        .end()
    .module
        .rule('ts')  // 解析ts和tsx，rule规则从下往上
            .test(/\.tsx?$/)
            .loader("babel-loader?cacheDirectory=true")
            .exclude(/node_moudules/)
            .end()
        .rule('source-map')
            .test(/\.js$/)
            .loader("source-map-loader")
            .enforce("pre")
            .end()
        .rule('css')
            .test(/\.(le|c)ss$/)
            .use([ devMode ? "style-loader" : MiniCssExtractPlugin.loader,'css-loader','postcss-loader','less-loader'])
            .exclude(/node_moudules/)
            .end()
        .rule('picture')
            .test(/\.(png|jpe?g|gif|svg)(\?.*)?$/)
            .loader("url-loader")
            .exclude(/node_moudules/)
            .end()
    .devServer
        .port(8080)
        .hot(true)
        .before((app) => mock(app))
        .contentBase(resolve('dist'))
        .historyApiFallback({
            index:"../src/index.html",
        })
        .end()
    .plugin('NamedModulesPlugin')
        .use(webpack.NamedModulesPlugin)
        .end()
    .plugin('HotModuleReplacementPlugin')
        .use(webpack.HotModuleReplacementPlugin)
        .end()
    .plugin('MiniCssExtractPlugin')
        .use(MiniCssExtractPlugin,{
            filename: "[name].[contenthash:8].css",
            chunkFilename: "chunk/[id].[contenthash:8].css",
        })
        .end()
    
module.exports = config.toConfig();