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
    rules: [
      {
        test: /\.(js|jsx)$/,
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
    extensions: ['.js', '.jsx'],
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

/**
 * 获取样式加载器
 */
function getStyleLoaders(loaders) {
  let defaultLoaders = [
    'style-loader',
    'css-loader',
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