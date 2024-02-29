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
    entry: './src/main.ts',
    output: {
        // 开发模式没有输出
        path: undefined,
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js'
    },
    module: {
        rules: [
            // {
            // oneOf: [
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
                type: 'asset',
                parser: {
                    dataUrlCondition: {
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
            //     ]
            // }
        ],
    },
    plugins: [
        new ESLintPlugin({
            context: path.resolve(__dirname, './src'),
            cache: true
        }),
        new HTMLWebpackPlugin({
            template: path.resolve(__dirname, './public/index.html')
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
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        extensions: ['.vue', '.ts', '.js', '.json']
    },
    mode: 'development',
    devtool: 'cheap-module-source-map',
    devServer: {
        host: 'localhost',
        port: '80',
        open: true,
        hot: true
    }
}