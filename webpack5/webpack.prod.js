const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const os = require('os');
const TerserPlugin = require('terser-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');

/**
 * 获取样式加载器
 */
function getStyleLoader(loaders) {
    let defaultLoaders = [
        // 用插件中的loader替换style-loader
        MiniCssExtractPlugin.loader,
        'css-loader',
        // 注意postcss-loader的位置
        'postcss-loader'
    ];
    return loaders ? [...defaultLoaders, ...loaders] : defaultLoaders;
}

module.exports = {
    entry: {
        main: './src/main.ts',
        app: './src/app.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        // [name]指entry中的key值
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].chunk.[contenthash:8].js',
        // 在打包前，将path整个目录清空，再进行打包
        clean: true,
        environment: {
            // 编译结果不使用箭头函数
            arrowFunction: false
        }
    },
    module: {
        rules: [
            {
                // 每个文件只能被其中一个加载器处理
                oneOf: [
                    {
                        test: /\.ts$/i,
                        exclude: /(node_modules)/,
                        use: [
                            {
                                loader: 'thread-loader',
                                options: {
                                    workers: os.cpus().length
                                }
                            },
                            {
                                loader: 'babel-loader',
                                options: {
                                    // 开启缓存
                                    cacheDirectory: true,
                                    // 关闭缓存压缩，缓存文件并不会上线，仅占用本地存储空间
                                    // 且压缩缓存文件，会影响打包速度
                                    cacheCompression: false,
                                }
                            }
                        ]
                    },
                    {
                        test: /\.css$/i,
                        use: getStyleLoader()
                    },
                    {
                        test: /\.less$/i,
                        use: getStyleLoader(['less-loader'])
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
                ]
            }
        ],
    },
    plugins: [
        new ESLintPlugin({
            // 待检查的文件目录，绝对路径
            context: path.resolve(__dirname, './src'),
            // 若检查ts，需指定文件类型
            extensions: ['.ts', '.js'],
            // 出现错误时终止构建
            failOnError: true,
            // 开启缓存
            // 缓存文件的默认路径为
            // node_modules/.cache/eslint-webpack-plugin/.eslintcache
            cache: true
        }),
        new HTMLWebpackPlugin({
            // 使用public下的模板文件，保持DOM结构一致，同时自动引入js
            template: path.resolve(__dirname, './public/index.html')
        }),
        new MiniCssExtractPlugin({
            // 指定文件名和路径
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].chunk.[contenthash:8].css',
        }),
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        })
    ],
    // 官方文档，将压缩操作配置在optimization中
    optimization: {
        minimize: true,
        minimizer: [
            // css压缩插件
            new CssMinimizerPlugin(),
            // webpack5内置js压缩操作
            new TerserPlugin({
                parallel: os.cpus().length
            })
        ],
        splitChunks: {
            // 所有模块（即main.ts、app.ts）都进行分割
            chunks: 'all',
            // 该插件有很多默认配置，以下代码进行默认配置的覆盖
            cacheGroups: {
                default: {
                    // 默认打包的文件大小为20kb，这里修改为0
                    minSize: 0,
                    // 让自定义组获得更高的优先级
                    priority: -20,
                    // 被拆分出的模块将被重用
                    reuseExistingChunk: true,
                }
            },
        },
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        }
    },
    resolve: {
        // 配置别名
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        // 设置引用模块（设置哪些文件可以作为模块使用）。若使用ts，这里必须配置
        extensions: ['.ts', '.js']
    },
    mode: 'production',
    devtool: 'source-map'
}