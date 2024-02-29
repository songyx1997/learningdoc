const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

/**
 * 获取样式加载器
 */
function getStyleLoaders(loaders) {
    let defaultLoaders = [
        'vue-style-loader',
        'css-loader',
        {
            loader: 'postcss-loader',
            options: {
                postcssOptions: {
                    plugins: ['postcss-preset-env']
                }
            }
        }
    ];
    return loaders ? [...defaultLoaders, ...loaders] : defaultLoaders;
}

module.exports = {
    entry: '../src/main.js',
    output: {
        // 开发模式没有输出
        path: undefined,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js'
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.css$/,
                        use: getStyleLoaders()
                    },
                    {
                        test: /\.less$/,
                        use: getStyleLoaders(['less-loader'])
                    },
                    {
                        test: /\.(jpe?g|png|webp|gif|bmp)$/i,
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
                    },
                    {
                        test: /\.vue$/,
                        loader: 'vue-loader'
                    },
                    {
                        test: /\.js$/i,
                        include: path.resolve(__dirname, '../src'),
                        // loader只能写单个加载器
                        loader: 'babel-loader',
                        options: {
                            cacheDirectory: true,
                            cacheCompression: false,
                        }
                    },
                ]
            }
        ],
    },
    plugins: [
        new ESLintPlugin({
            // 待检查的文件目录，绝对路径
            context: path.resolve(__dirname, '../src'),
            cache: true
        }),
        new HTMLWebpackPlugin({
            // 使用public下的模板文件，保持DOM结构一致，同时自动引入js
            template: path.resolve(__dirname, '../public/index.html')
        }),
        new VueLoaderPlugin()
    ],
    optimization: {
        splitChunks: {
            chunks: 'all'
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        }
    },
    resolve: {
        // 配置别名
        alias: {
            '@': path.resolve(__dirname, '../src')
        },
        // 设置引用模块（设置哪些文件可以作为模块使用）。若使用ts，这里必须配置
        extensions: ['.vue', '.ts', '.js', 'json']
    },
    mode: 'development',
    // 开发服务器
    devServer: {
        host: 'localhost',
        port: '3000',
        open: true,
        // 开启热模块替换（默认值为true）
        hot: true
    },
    devtool: 'cheap-module-source-map'
}