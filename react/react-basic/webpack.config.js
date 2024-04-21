const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    // 开发模式没有输出
    path: undefined,
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
  ],
  resolve: {
    extensions: ['.js', '.jsx'],
  },
  mode: 'development',
  // 仅提供列映射
  devtool: 'cheap-module-source-map',
  devServer: {
    host: 'localhost',
    port: '80',
    // 开启热模块替换（默认值为true）
    hot: true,
  }
}