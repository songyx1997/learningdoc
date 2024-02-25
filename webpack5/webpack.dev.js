const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    entry: './src/main.ts',
    output: {
        // 开发模式没有输出
        path: undefined,
        // 入口文件打包输出的文件名
        filename: 'static/js/bundle.js',
        environment: {
            // 编译结果不使用箭头函数
            arrowFunction: false
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/i,
                exclude: /(node_modules)/,
                // loader只能写单个加载器
                loader: 'babel-loader'
            },
            {
                test: /\.css$/i,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.less$/i,
                use: [
                    'style-loader',
                    'css-loader',
                    'less-loader',
                ],
            },
            {
                test: /\.(jpe?g|png|webp|gif|bmp)$/i,
                // 图片会转换为base64
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        // 最大10kb，10kb以内的将被转换为base64
                        maxSize: 10 * 1024,
                    }
                },
                generator: {
                    // 指定输出的文件目录
                    // hash-文件名、ext-文件后缀、query-查询字符串
                    filename: 'static/images/[hash][ext][query]'
                }
            },
            {
                test: /\.(ttf|woff2?|mp3|mp4|avi)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/media/[hash][ext][query]'
                }
            }
        ],
    },
    plugins: [
        new ESLintPlugin({
            // 待检查的文件目录，绝对路径
            context: path.resolve(__dirname, './src')
        }),
        new HTMLWebpackPlugin({
            // 使用public下的模板文件，保持DOM结构一致，同时自动引入js
            template: path.resolve(__dirname, './public/index.html')
        }),
    ],
    resolve: {
        // 配置别名
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        // 设置引用模块（设置哪些文件可以作为模块使用）。若使用ts，这里必须配置
        extensions: ['.ts', '.js']
    },
    mode: 'development',
    // 开发服务器
    devServer: {
        host: 'localhost',
        port: '3000',
        open: true
    }
}