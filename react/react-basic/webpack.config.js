const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const isProduction = process.env.NODE_ENV === 'production';

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: isProduction ? path.resolve(__dirname, './dist') : undefined,
    filename: `static/js/[name]${isProduction ? '.[contenthash:8]' : ''}.js`,
    chunkFilename: `static/js/[name].chunk${isProduction ? '.[contenthash:8]' : ''}.js`,
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
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
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
    new HTMLWebpackPlugin({
      // 使用public下的模板文件，保持DOM结构一致，同时自动引入js
      template: path.resolve(__dirname, './public/index.html')
    }),
    isProduction && new MiniCssExtractPlugin({
      // 指定文件名和路径
      filename: 'static/css/[name].[contenthash:8].css',
      chunkFilename: 'static/css/[name].chunk.[contenthash:8].css',
    }),
    isProduction && new CopyPlugin({
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
  ].filter(Boolean),
  // 压缩
  optimization: {
    minimize: isProduction,
    minimizer: [
      // css压缩插件
      new CssMinimizerPlugin(),
      // webpack5内置js压缩操作
      new TerserPlugin()
    ],
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
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json', '.less']
  },
  mode: process.env.NODE_ENV,
  devtool: isProduction ? 'source-map' : 'cheap-module-source-map',
  devServer: {
    host: 'localhost',
    port: '80',
    // 开启热模块替换（默认值为true）
    hot: true
  }
}

/**
 * 获取样式加载器
 */
function getStyleLoaders(loaders) {
  let defaultLoaders = [
    isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
    {
      loader: 'css-loader',
      options: {
        modules: {
          // 自定义类名生成规则
          localIdentName: '[path][name]__[local]--[hash:base64:5]',
        }
      },
    },
    {
      // 配合package.json中的browserslist，指定兼容性
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