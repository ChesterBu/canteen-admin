const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const srcDir = path.join(__dirname, '../src');
const devMode = process.env.NODE_ENV !== 'production';

module.exports = {
  entry: {
    main: path.join(__dirname, '../src/index.tsx'),
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name].[chunk:8].js',
    publicPath: "/",
    chunkFilename: 'chunk/[name].[chunkhash:8].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        include: [srcDir],
        exclude: /node_modules/,
        use: ['babel-loader?cacheDirectory=true'],
      },
      {
        test: /\.less$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /\.css$/,
        use: [
          devMode ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: ['url-loader'],
        include: [srcDir],
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        use: ['url-loader'],
        include: [srcDir],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: ['url-loader'],
        include: [srcDir],
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: `${srcDir}/index.html`,
    }),
  ],
  resolve: {
    alias: {
      '@': srcDir,
      '@pages': `${srcDir}/pages`,
    },
    extensions: [".ts", ".tsx", ".js", ".json"],
  },
  // optimization: {
  //   removeAvailableModules: true, // 删除已解决的chunk (默认 true)
  //   removeEmptyChunks: true, // 删除空的chunks (默认 true)
  //   mergeDuplicateChunks: true // 合并重复的chunk (默认 true)
  // }
};