const path = require('path');
// const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const { DefinePlugin } = require('webpack');

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
    entry: './src/main.ts',
    output: {
        // 开发模式没有输出
        path: undefined,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
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
        // new ESLintPlugin({
        //     context: path.resolve(__dirname, './src'),
        //     cache: true
        // }),
        new HTMLWebpackPlugin({
            // 使用public下的模板文件，保持DOM结构一致，同时自动引入js
            template: path.resolve(__dirname, './public/index.html')
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
        })
    ],
    // 压缩
    optimization: {
        // 代码分割
        splitChunks: {
            chunks: 'all'
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