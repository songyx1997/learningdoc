const path = require('path');
// 引入html插件
const HTMLWebpackPlugin = require('html-webpack-plugin');
// 引入清除插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    // 入口文件
    entry: './src/index.ts',
    // 输出路径及文件名
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
        environment: {
            // 编译结果不使用箭头函数
            arrowFunction: false
        }
    },
    // 需要使用的模块
    module: {
        // 指定加载的规则
        rules: [
            {
                // 规则生效的文件（这里是所有ts结尾的文件）
                test: /\.ts$/,
                exclude: '/node_modules',
                // 注意：加载器的执行顺序为从后往前
                use: [
                    {
                        loader: 'babel-loader',
                        // 设置babel
                        options: {
                            // 设置预定义的环境
                            presets: [
                                [
                                    // 指定环境的插件
                                    '@babel/preset-env',
                                    // 配置信息
                                    {
                                        targets: {
                                            // 兼容的浏览器版本
                                            'ie': '11'
                                        },
                                        // 指定的corejs版本
                                        'corejs': '3',
                                        // 使用corejs的方式：按需加载
                                        'useBuiltIns': 'usage'
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader'
                ]
            }
        ]
    },
    // 设置引用模块（设置哪些文件可以作为模块使用）
    resolve: {
        extensions: ['.ts', '.js']
    },
    // 配置插件
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin()
    ]
}