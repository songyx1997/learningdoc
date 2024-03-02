const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { DefinePlugin } = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

/**
 * 获取样式加载器
 */
function getStyleLoaders(loaders) {
    let defaultLoaders = [
        // 用插件中的loader替换vue-style-loader
        MiniCssExtractPlugin.loader,
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
    entry: './src/main.ts',
    output: {
        path: path.resolve(__dirname, './dist'),
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
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    // 开启loader缓存
                    cacheDirectory: path.resolve(__dirname, './node_modules/.cache/vue-loader')
                }
            },
            {
                test: /\.ts$/,
                include: path.resolve(__dirname, './src'),
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true,
                    cacheCompression: false,
                }
            },
            {
                test: /\.css$/,
                use: getStyleLoaders()
            },
            {
                test: /\.less$/,
                use: getStyleLoaders(['less-loader'])
            },
            {
                test: /\.(jpe?g|png|webp|gif|bmp)$/,
                // 图片会转换为base64
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        // 最大10kb，10kb以内的将被转换为base64
                        maxSize: 10 * 1024,
                    }
                },
                generator: {
                    filename: 'static/images/[hash][ext][query]'
                }
            },
            {
                test: /\.(ttf|woff2?|mp3|mp4|avi)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'static/media/[hash][ext][query]'
                }
            }
        ],
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, './src'),
            // 若检查ts以及vue文件内的ts代码，需指定文件类型
            extensions: ['.ts', '.js', '.vue'],
            // 出现错误时终止构建
            emitError: true,
            emitWarning: false,
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
        new VueLoaderPlugin(),
        // cross-env定义的环境变量给打包工具使用
        // 用于定义环境变量给源代码使用，用于解决Vue3页面警告
        new DefinePlugin({
            // 启用配置项式API
            __VUE_OPTIONS_API__: true,
            // 开发模式下启用开发工具
            __VUE_PROD_DEVTOOLS__: true,
            __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: false
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, './public'),
                    to: path.resolve(__dirname, './dist'),
                    globOptions: {
                        // 忽略index.html文件
                        ignore: ['**/index.html'],
                    },
                },
            ],
        }),
    ],
    // 压缩
    optimization: {
        minimize: true,
        minimizer: [
            // css压缩插件
            new CssMinimizerPlugin(),
            // webpack5内置js压缩操作
            new TerserPlugin()
        ],
        // 代码分割
        splitChunks: {
            chunks: 'all',
            cacheGroups: {
                vue: {
                    test: /[\\/]node_modules[\\/]vue(.*)?[\\/]/,
                    name: 'chunk-vue',
                    priority: 30,
                },
                'ant-design-vue': {
                    test: /[\\/]node_modules[\\/]ant-design-vue[\\/]/,
                    name: 'chunk-ant-design-vue',
                    priority: 20,
                },
                libs: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'chunk-libs',
                    priority: 10,
                },
            },
        },
        // 用临时文件记录文件间hash值的关系，便于缓存
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        }
    },
    resolve: {
        // 配置别名
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        // 设置引用模块（设置哪些文件可以作为模块使用）
        extensions: ['.vue', '.ts', '.js', '.json']
    },
    mode: 'production',
    devtool: 'source-map'
}