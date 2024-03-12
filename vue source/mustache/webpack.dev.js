const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/index.js',
    output: {
        // 开发模式没有输出
        path: undefined,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js'
    },
    module: {
        rules: [],
    },
    plugins: [
        new HTMLWebpackPlugin({
            // 使用public下的模板文件，保持DOM结构一致，同时自动引入js
            template: path.resolve(__dirname, './public/index.html')
        })
    ],
    resolve: {
        // 配置别名
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        // 设置引用模块（设置哪些文件可以作为模块使用）
        extensions: ['.js', '.json']
    },
    mode: 'development',
    // 仅提供列映射
    devtool: 'cheap-module-source-map',
    devServer: {
        host: 'localhost',
        port: '80',
        // 开启热模块替换（默认值为true）
        hot: true
    }
}