<table>
    <tr>
        <td>title：webpack5</td>
        <td>author：songyx</td>
        <td>date：2024/02/24</td>
    </tr>
</table>
### 基础

#### 开发模式

##### 安装

```shell
npm i -D webpack webpack-cli
```

##### 5大核心概念

1. `entry`：指示`webpack`以哪个文件为入口起点开始打包，分析构建内部依赖图（**相对路径**）。

2. `output`：指示 `webpack`打包后的资源输出到哪里，如何命名（**绝对路径**）。

3. `loader`：`webpack`只能理解`JS`和`JSON`文件。`loader`让`webpack`能够去处理其他类型的文件。

4. `plugins`：扩展`webpack`的功能。

5. `mode`：包括两种模式。`development`-开发模式、`production`-生产模式，生产模式可以压缩代码。

```javascript
const path = require('path');
module.exports = {
    entry: './main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        // 入口文件打包输出的文件名
        filename: 'js/bundle.js',
        // 在打包前，将path整个目录清空，再进行打包
        clean: true,
    },
    module: {
        rules: [],
    },
    plugins: [],
    mode: 'development'
}
```

注意：`loader`从右到左（或从下到上）地取值(`evaluate`)/执行(`execute`)。

##### resolve

定义模块如何被解析和定位，在构建过程中，`webpack`需要处理各种导入语句（`import、require`）。

最常用的有`alias`（别名）、`extensions`（可以作为模块的文件）

```typescript
module.exports = {
    resolve: {
        // 配置别名
        alias: {
            '@': path.resolve(__dirname, './src')
        },
        // 设置引用模块（设置哪些文件可以作为模块使用）。若使用ts，这里必须配置
        extensions: ['.ts', '.js']
    }
}
```

##### 处理css、less

`style-loader` ：把`CSS`插入到`DOM`中。

`css-loader`： 会对 `@import` 和 `url()` 进行处理，解决依赖问题。就像`js` 解析 `import/require()` 一样。

`less-loader`：`webpack`将`less`编译为`CSS`的`loader`。

```javascript
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
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
        ],
    },
}
```

##### 处理图片

`webpack5`内置了对图片资源的处理，不需要添加加载器，但是实际开发中会进行定制。

如：小于`10kb`的图片转换为`base64`(将图片转换为字符串，转换后体积将会变大，因此常用于小图片)。**可以减少网络请求**。

```javascript
module.exports = {
    module: {
        rules: [
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
            }
        ],
    }
}
```

##### 处理字体图标、其他资源

注意这里的`type: 'asset/resource'`，因为这些资源都要保持原样，不能转换为`base64`。

```typescript
module.exports = {
    module: {
        rules: [
            {
                test: /\.(ttf|woff2?|mp3|mp4|avi)$/i,
                type: 'asset/resource',
                generator: {
                    filename: 'static/media/[hash][ext][query]'
                }
            }
        ],
    }
}
```

##### eslint

`eslint`的配置文件位于根目录，以`.eslintrc.js`为例，如下：

```typescript
module.exports = {
    // 解析选项
    parserOptions: {
        // ES语法版本。若这里指定5，那么代码中使用ES6语法将会报错
        ecmaVersion: 6,
        // ES模块化
        sourceType: 'module'
    },
    env: {
        // 启用node中的全局变量，如globalThis
        node: true,
        // 启动浏览器中的全局变量，如console
        browser: true
    },
    // 具体检查规则，优先级高于继承的规则
    rules: {
        // 比如，禁止使用var定义变量
        'no-var': 2
    },
    // 继承其他规则（这里继承了Vue、eslint的官方规则）
    extends: ['plugin:vue/vue3-recommended', 'eslint:recommended']
}
```

对于规则，有如下三个选择：

1. `off`或`0`，关闭规则。
2. `warn`或`1`，开启规则，但不会导致程序退出。
3. `error`或`2`，开启规则，当触发时，程序退出。

在`webpack`中进行配置，是配置在`plugins`选项中

```typescript
const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    plugins: [
        new ESLintPlugin({
            // 待检查的文件目录，绝对路径
            context: path.resolve(__dirname, './src')
        })
    ]
}
```

##### babel

`eslint`的配置文件位于根目录，以`babel.config.js`为例，如下：

```typescript
module.exports = {
    // 预设
    presets: [
        // 智能预设，将最新js编译为es5
        ['@babel/preset-env', {
            targets: {
                // 兼容的浏览器版本
                'ie': '11'
            },
            // 指定的corejs版本
            // 当使用promise时，从corejs内引入promise源码
            corejs: 3,
            // 使用corejs的方式：按需加载
            useBuiltIns: 'usage'
        }],
        // 将ts编译为js
        '@babel/preset-typescript'
    ]
}
```

在`webpack`中进行配置，配置在`loader`选项中。

```typescript
module.exports = {
    module: {
        rules: [
            {
                test: /\.ts$/i,
                exclude: /(node_modules)/,
                // loader只能写单个加载器
                loader: 'babel-loader'
            }
        ]
    }
}
```

##### 处理HTML

自动将`js`导入`HTML`，配置在`plugins`选项中。

```typescript
module.exports = {
    plugins: [
        new HTMLWebpackPlugin({
            // 使用public下的模板文件，保持DOM结构一致，同时自动引入js
            template: path.resolve(__dirname, './public/index.html')
        }),
    ]
}
```

打包后的`index.html`引入`js`的代码如下

```html
<script defer src="js/bundle.js"></script>
```

`defer`是布尔属性，添加了该属性的脚本会异步加载。浏览器解析`HTML`时并行下载，但是会等到`HTML`解析完成后才会按照顺序执行。这样有助于优化网页性能，确保下渲染路径不受阻塞，从而改善用户体验。

#### 生产模式

##### MiniCssExtractPlugin

之前的打包方案中，将`css`打包进`js`中。这样当网速较慢时，`js`载入完成，页面中的样式才会加载，用户体验较差，应该优化为创建单独的`css`文件，并通过`link`标签自动载入。

```typescript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    // 用插件中的loader替换style-loader
                    MiniCssExtractPlugin.loader,
                    'css-loader'
                ]
            },
            {
                test: /\.less$/i,
                use: [
                    // 用插件中的loader替换style-loader
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    'less-loader',
                ],
            }
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            // 指定文件名和路径
            filename: 'static/css/all.css'
        })
    ],
    mode: 'production'
}
```

该插件将全部用到的`css`文件打包到`all.css`文件中，并实现了异步加载。

##### postcss-loader

使用该加载器，进行`css`兼容性处理。

`postcss`可以使用单独的配置文件`postcss.config.js`

```typescript
module.exports = {
    plugins: [
        [
            'postcss-preset-env'
        ],
    ],
};
```

同时注意加载器的位置

```typescript
module.exports = {
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    // 用插件中的loader替换style-loader
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    // 注意postcss-loader的位置
                    'postcss-loader'
                ]
            },
            {
                test: /\.less$/i,
                use: [
                    // 用插件中的loader替换style-loader
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    // 注意postcss-loader的位置
                    'postcss-loader',
                    'less-loader'
                ],
            }
        ]
    }
}
```

在`package.json`中配置浏览器选项：`browserslist`。

```json
{
  "browserslist": [
    "ie >= 8"
  ]
}
```

上面表示浏览器最低版本为IE8。打包后，比如`display: flex`，将会被打包为`display: -ms-flexbox`。

实际开发中常用配置如下：

```json
{
  "browserslist": [
    "last 2 version",
    "> 1%",
    "not dead"
  ]
}
```

1. `last 2 version`：最新的两个大版本。

2. `> 1%`：覆盖市面上`99%`的浏览器。

3.  `not dead`：去除掉死掉的版本。

当使用`,`或者`or`时，表示或。当使用`and`时，表示且。当使用`not`时，表示非。

##### 封装

将重复的配置项进行封装。

```typescript
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
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: getStyleLoader()
            },
            {
                test: /\.less$/i,
                use: getStyleLoader(['less-loader'])
            }
        ],
    }
}
```

##### 压缩css

压缩`css`使用插件`css-minimizer-webpack-plugin`，并支持缓存和并发模式下运行。

```typescript
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
    plugins: [
        new MiniCssExtractPlugin({
            // 指定文件名和路径
            filename: 'static/css/all.css'
        }),
        new CssMinimizerPlugin()
    ],
    mode: 'production'
}
```

##### 其他压缩

生产模式默认开启了`html`压缩与`js`压缩。

### 高级

#### 提升开发体验

##### sourceMap

为了方便排查错误。

配置`devtool`，不同的值会明显影响到构建`(build)`和重新构建`(rebuild)`的速度。

开发模式下使用`cheap-module-source-map`，打包编译速度快，但只包含行映射（因为开发模式下，代码都是格式化的，不需要列映射），报错时显示文件的哪一行。

```typescript
module.exports = {
    mode: 'development',
    devtool: 'cheap-module-source-map'
}
```

生产模式下使用`source-map`。因为代码被压缩，既需要行映射，也需要列映射。

```typescript
module.exports = {
    mode: 'production',
    devtool: 'source-map'
}
```

#### 提升打包速度

##### HMR

热模块替换`(HotModuleReplacement)`。当程序运行时，替换、添加或删除模块，无需加载整个页面。

开发模式下是默认开启的。

```typescript
module.exports = {
    mode: 'development',
    devServer: {
        host: 'localhost',
        port: '3000',
        open: true,
        // 开启热模块替换（默认值为true）
        hot: true
    },
}
```

针对`css`文件，`style-loader`中实现了`HMR`。

针对`js`文件，`vue-loader、react-hot-loader`中实现了`HMR`。

##### oneOf

不同文件打包时，按照顺序采用`module.rules`数组中的规则。如果是`ts`文件，则第一条规则就命中。但如果是`css`文件，到第二条规则才会命中。

```typescript
module.exports = {
    module: {
        rules: [
            {
                // 每个文件只能被其中一个加载器处理
                oneOf: [
                    {
                        test: /\.ts$/i,
                        exclude: /(node_modules)/,
                        // loader只能写单个加载器
                        loader: 'babel-loader'
                    },
                    {
                        test: /\.css$/i,
                        use: getStyleLoader()
                    }
                ]
            }
        ]
    }
}
```

##### include/exclude

主要针对`js`文件，主要排除`node_modules`，因为开发项目很少使用外部`css`文件。

##### cache

为`eslint、babel`建立缓存。初次打包完成后，之后打包只针对修改的文件。

对于`babel`，需要注意的是`babel.config.js`用于处理预设(`presets`)和插件(`plugins`)，缓存的配置项应放置在`loader: 'babel-loader'`下面。

缓存文件的默认路径为：`node_modules\.cache\babel-loader`。

```typescript
module.exports = {
    module: {
        rules: [
            {
                // 每个文件只能被其中一个加载器处理
                oneOf: [
                    {
                        test: /\.ts$/i,
                        exclude: /(node_modules)/,
                        // loader只能写单个加载器
                        loader: 'babel-loader',
                        options: {
                            // 开启缓存
                            cacheDirectory: true,
                            // 关闭缓存压缩
                            // 缓存文件并不会上线，仅占用本地存储空间
                            // 且压缩缓存文件，会影响打包速度
                            cacheCompression: false,
                        }
                    },
                ]
            }
        ]
    }
}
```

对于`eslint`，缓存文件的默认路径为：`node_modules/.cache/eslint-webpack-plugin/.eslintcache`。

```typescript
module.exports = {
    plugins: [
        new ESLintPlugin({
            // 待检查的文件目录，绝对路径
            context: path.resolve(__dirname, './src'),
            // 若检查ts，需指定文件类型
            extensions: ['.ts', '.js'],
            // 出现错误时终止构建
            failOnError: true,
            // 开启缓存
            cache: true
        })
    ]
}
```

##### thead

多进程打包(`thead[θred]`)。

开启多进程打包，应该针对比较耗时的操作（如`js`），因为每个进程启动需要`600ms`左右的开销。

```typescript
const os = require('os');
module.exports = {
    module: {
        rules: [
            {
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
                            }
                        ]
                    }
                ]
            }
        ],
    }
}
```

另外，代码压缩也可以开启多进程。`terser`是`webpack`内置的插件，用于`js`代码压缩。

```typescript
const os = require('os');
module.exports = {
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
    }
}
```

#### 减少代码体积

##### Tree Shaking

字面意思为树摇，去掉多余的枯叶。

生产模式下默认开启。作用是引入第三方库时，打包时去除没有使用上的代码。

##### babel

对于公共代码，`babel`会添加辅助代码，如`_extend`。并被添加至每一个需要它的文件内，造成了重复定义。

在`babel.config.js`中引入插件`@babel/plugin-transform-runtime`。其作用是需要辅助代码时，从该插件中引入，而避免重复定义。

```typescript
module.exports = {
    presets: [],
    plugins: [
        '@babel/plugin-transform-runtime'
    ]
}
```

##### 图片压缩

主要使用插件`image-minimizer-webpack-plugin`。

压缩方式包括：无损压缩、有损压缩。

#### 优化代码运行性能

##### 代码分割

代码分割(`code split`)实现了：

1. 分割文件：将打包生成的文件进行分割，生成多个`js`文件。
2. 懒加载：需要哪个`js`文件就加载哪个。

实现代码分割有多种方式。

方式一：多入口(`entry`)与多输出(`output`)

```typescript
module.exports = {
    entry: {
        one: './src/main.ts',
        two: './src/app.ts'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        // [name]指entry中的key值（上面的one、two）
        filename: 'static/js/[name].js',
    }
}
```

`Tips`：多入口文件，每个文件都被称为`chunk`；多输出的文件，每个文件都被称为`bundle`。

需要注意的一点，当多入口文件引用了公共代码，就希望将公共的代码在打包时单独形成`js`文件，而不是将公共的代码都打包进`bundle`中。

```typescript
module.exports = {
    optimization: {
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
    },
};
```

方式二：懒加载

场景：点击按钮时，才去拉取点击事件的相关代码。

首先配置`eslint`，引入插件`eslint-plugin-import`。`.eslintrc.js`文件中

```typescript
module.exports = {
    plugins: [
        // 引入ts插件
        '@typescript-eslint',
        // 解决动态导入语法错误
        'import'
    ]
}
```

在`main.ts`入口中调用模块`method.ts`的代码。

在`app.ts`入口中也调用模块`method.ts`的代码。

```typescript
const el = document.getElementById('demand-loading-one') as HTMLButtonElement;
el.onclick = function () {
    import('./common/method').then((value) => {
        const { onDemandLoadingOne } = value;
        onDemandLoadingOne();
    }).catch(() => {
        console.log('模块加载失败~');
    })
}
```

进行打包，点击按钮。将`method.ts`中被用到的方法，打包进`755.js`，并在点击事件触发时被拉取。

<div style="border:2px solid #42b883"><img src=".\懒加载.png"></div>

方式三：单入口文件

配置了`splitChunks`，仅能将`node_modules`中的代码提取成单独的`chunk`。

```typescript
module.exports = {
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};
```

但是懒加载的代码，依然会被打包成单独的`chunk`。

##### 命名规范

首先给动态导入指定`webpack魔法注释`。

```typescript
const el = document.getElementById('demand-loading-one') as HTMLButtonElement;
el.onclick = function () {
    // webpack魔法命名
    import(/* webpackChunkName: 'method' */'./common/method').then((value) => {
        const { onDemandLoadingOne } = value;
        onDemandLoadingOne();
    }).catch(() => {
        console.log('模块加载失败~');
    })
}
```

这样在配置文件中就可以使用`[name]`。

```typescript
module.exports = {
    entry: {
        main: './src/main.ts',
        app: './src/app.ts'
    },
    output: {
        // [name]指entry中的key值
        filename: 'static/js/[name].js',
        chunkFilename: 'static/js/[name].chunk.js',
    },
    plugins: [
        new MiniCssExtractPlugin({
            // css也可以使用多入口、动态导入
            // 命名规范和js类似
            filename: 'static/css/[name].css',
            chunkFilename: 'static/css/[name].chunk.css',
        })
    ]
}
```

##### Preload、Prefetch

即使配置了懒加载，但是懒加载的代码体积很大，用户体验并不好。因此使用`Preload、Prefetch`使浏览器暗中加载未来需要使用的资源。

`Preload`：告知浏览器立即加载资源，优先级高，但是只能加载当前页面的资源。

`Prefetch`：告知浏览器在空闲时才开始加载资源，优先级低，既能加载当前页面，也可以加载下一个页面。

二者的共同点是：只加载不执行，且都有缓存。

二者都存在的问题：都存在兼容性问题。截止目前，`Preload`对市面上浏览器支持率为`97.29%`。`Prefetch`对市面上浏览器支持率为`79.96%`。因此使用时推荐使用`Preload`。

代码中借助`webpack魔法注释`实现。

```typescript
import(/* webpackPreload: true */ 'ChartingLibrary');
import(/* webpackPrefetch: true */ './path/to/LoginModal.js');
```

<div><img style="border:2px solid #42b883" src=".\prefetch.png"></div>

##### contenthash

在输出文件名中，使用该占位符。这样只有当文件修改时，才会改变文件的`hash`值，因此实现了**缓存**。

```typescript
module.exports = {
    output: {
        filename: 'static/js/[name].[contenthash:8].js',
        chunkFilename: 'static/js/[name].chunk.[contenthash:8].js',
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: 'static/css/[name].[contenthash:8].css',
            chunkFilename: 'static/css/[name].chunk.[contenthash:8].css',
        })
    ]
}
```

##### runtimeChunk

基于`contenthash`实现的缓存，存在一个问题：在`A`模块中引入了`B`模块。当`B`模块发生变化，其`hash`值变化，同时`A`模块的`hash`值也变化，导致缓存失效。

```typescript
module.exports = {
  optimization: {
    runtimeChunk: {
      name: (entrypoint) => `runtime~${entrypoint.name}`,
    },
  },
};
```

借助于`runtimeChunk`。当`B`模块发生变化时，其`hash`值变化，同时`runtime`文件(记录文件之间`hash`值的依赖关系)的`hash`值变化，但是对`A`模块的`hash`值无影响，实现了更好的缓存效果。

<div style="width:80%"><img style="border:2px solid #42b883" src=".\runtimeChunk.jpg"></div>

##### PWA

借助插件`workbox-webpack-plugin`实现`渐进式网络应用程序(progressive web application - PWA)`。

`PWA`可以用来做很多事。其中最重要的是，在**离线**时应用程序能够继续运行功能。

```typescript
const WorkboxPlugin = require('workbox-webpack-plugin');
module.exports = {
    plugins: [
        new WorkboxPlugin.GenerateSW({
            clientsClaim: true,
            skipWaiting: true,
        })
    ]
}
```

### 项目-Vue

#### 开发模式

##### 基础配置

1. 处理`vue`文件，使用`vue-loader、vue-template-compiler`。需要注意每次升级项目中的 `vue` 时，也应该匹配升级 `vue-template-compiler`。
2. 处理`vue`的样式，还需要使用`vue-style-loader`替换`style-loader`。
3. `vue3`会输出控制台警告，需要借助`webpack`的内置插件`DefinePlugin`。

```typescript
const { VueLoaderPlugin } = require('vue-loader');
const { DefinePlugin } = require('webpack');

module.exports = {
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader'
            },
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
    ],
    resolve: {
        // 设置引用模块（设置哪些文件可以作为模块使用）
        extensions: ['.vue', '.ts', '.js', '.json'],
    },
}
```

##### 使用ts

首先导入`tsconfig.json`，配置别名和`moduleResolution`，使`import`语法不再报错。

```json
{
    "include": [
        "src/**/*.ts",
        "src/**/*.d.ts",
        "src/**/*.vue"
    ],
    "compilerOptions": {
        "moduleResolution": "node",
        // 设置路径别名
        "paths": {
            "@/*": [
                "./src/*"
            ]
        },
    }
}
```

之后修改`babel`的配置。

```typescript
module.exports = {
    // 预设
    presets: [
        [
            // 将ts编译为js
            "@babel/preset-typescript", {
                // 支持所有文件扩展名（非常重要！！！）
                allExtensions: true
            },
        ],
    ]
}
```

最后修改`eslint`配置。

```typescript
module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        // 引入ts配置文件
        project: path.resolve(__dirname, './tsconfig.json'),
        // 扩展文件
        extraFileExtensions: ['.vue']
    },
    plugins: [
        // 引入ts插件
        '@typescript-eslint',
        'vue'
    ],
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ]
}
```

#### 生产模式

##### CopyPlugin

打包时，对于`public`目录下的内容，除了`index.html`外，其他的内容直接借助插件`copy-webpack-plugin`复制即可。

```typescript
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
    plugins: [
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
    ]
}
```

##### 路由懒加载

在路由文件中，非常适合实现懒加载。

```typescript
import { createRouter, createWebHistory } from 'vue-router';
// 借助webpack实现懒加载
const Home = () => import(/* webpackChunkName: 'home' */ '@/views/home.vue');
const Person = () => import(/* webpackChunkName: 'person' */ '@/views/person.vue');
const Help = () => import(/* webpackChunkName: 'help' */ '@/views/help.vue');

const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: '/',
            name: 'home',
            component: Home
        },
        {
            path: '/person',
            name: 'person',
            component: Person
        },
        {
            path: '/help',
            name: 'help',
            component: Help
        }
    ]
});
export default router;
```

并在`webpack`中进行配置

```typescript
module.exports = {
    // 压缩
    optimization: {
        // 代码分割
        splitChunks: {
            chunks: 'all',
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
        // 用临时文件记录文件间hash值的关系，便于缓存
        runtimeChunk: {
            name: (entrypoint) => `runtime~${entrypoint.name}`,
        }
    },
}
```

#### 合并配置

借助于`process.env.NODE_ENV`进行生产模式(`production`)与开发模式(`development`)的配置的合并。

```json
{
  "scripts": {
    "dev": "cross-env NODE_ENV=development webpack serve --config webpack.dev.js",
    "prod": "cross-env NODE_ENV=production webpack --config webpack.prod.js"
  }
}
```

```typescript
const isProduction = process.env.NODE_ENV === 'production';

/**
 * 获取样式加载器
 */
function getStyleLoaders(loaders) {
    let defaultLoaders = [
        isProduction ? MiniCssExtractPlugin.loader : 'vue-style-loader',
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
    plugins: [
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
```

#### 优化配置

##### 缓存

```typescript
module.exports = {
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
        ],
    },
}
```

需要注意的是，`vue-loader`并没有特定的缓存配置项，而是通过启用`webpack`的`loader`缓存。在`webpack5`中还可以全局开启缓存。

##### 拆分node_modules

`node_modules`会被打包成一个`js`文件，因此需要进行拆分，单独打包，大致分为三组。

1. `vue`相关的文件。
2. 引入的`ant-design-vue`。
3. 其余的`node_modules`。

```typescript
module.exports = {
    optimization: {
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
    },
}
```

### 原理-loader

#### 执行顺序

`pre > normal > inline > post`。前置、普通、内联、后置。

借助`enforce`配置`loader`的类型(`pre、post`)。若不指定则为普通`loader`，普通`loader`的执行顺序为从右往左、从下往上。

使用`inline loader`的方式如下：

```typescript
// 在js文件中导入css文件时直接指定加载器
import Styles from 'style-loader!css-loader?modules!./styles.css';
// 上述代码表示：对于./styles.css文件
// 首先使用css-loader(带modules参数)进行处理
// 然后再使用style-loader处理结果，最后将css样式注入到DOM中
```

#### 本质

`loader`是导出为一个函数的`node`模块。该函数在`loader`转换资源的时候调用。该函数中的`this`就是上下文(`context`)。

该函数包括三个入参：

1. `content`：`loader`需要处理的原始模块内容。
2. `sourceMap`：可选参数，用于传递`sourceMap`。
3. `meta`：可选参数，`loader`执行时的额外元数据，可以在`loader`链中传递信息。

#### 类型

`loader`类型包括四种：`同步、异步、raw、pitch`。

使用`pitch`可以实现熔断。

<div style="width:80%"><img style="border:2px solid #42b883" src=".\pitch.png"></div>

借助于`pitch`方法，可以实现`style-loader`。

```typescript
// remainingRequest表示剩下还需要处理的loader
module.exports.pitch = function (remainingRequest) {
    // 1.将remainingRequest中绝对路径修改为相对路径
    const path = remainingRequest.split('!').map((absolutePath) => {
        return this.utils.contextify(this.context, absolutePath);
    }).join('!');
    // path输出为../../../node_modules/css-loader/dist/cjs.js!./reset.css
    // 2.引入css-loader处理过的资源
    // 创建style，将内容插入页面中生效
    // 使用!!中止后续loader执行
    const script = `
      import style from '!!${path}';
      const styleEl = document.createElement('style');
      styleEl.innerHTML = style;
      document.head.appendChild(styleEl);
    `;
    // 3.中止后续loader执行
    return script;
}
```

#### 常用API

##### callback

将结果返回给`webpack`，常用于`同步loader`。

实现将js代码中的`console.log`全部移除的`nolog-loader.js`。

```javascript
// 同步loader
// 1.直接返回
// return content;
// 2.借助上下文中的API-callback
module.exports = function (content, sourceMap, meta) {
    let result = '';
    try {
        result = content.replace(/console\.log\(['"](.*)['"]\);?/g, '');
        this.callback(null, result, sourceMap, meta)
    } catch (e) {
        this.callback(e)
    }
}
```

##### async

该函数的调用将创建一个回调(`callback`，注意和上下文中的`callback`进行区分)，该回调可以放在异步方法内，因此常用于`异步loader`。

实现`my-babel-loader`，将`es6`代码转换为低版本`js`。

```javascript
const schema = require('./schemas/my-babel-schema.json');
const babel = require('@babel/core');
// 异步loader
module.exports = function (content) {
    // 获取配置的预设
    let options = this.getOptions(schema);
    // transform为异步方法，创建回调函数
    let callback = this.async();
    babel.transform(content, options, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.code);
        }
    });
    return content;
}
```

上述代码中还使用了`getOptions`。

##### getOptions

获取`loader`的`options`，该`API`的入参为`schema`。

`JSON Schema`是一种用于描述`JSON`数据格式和结构的标准规范。上面自定义`babel-loader`使用的就是`my-babel-schema.json`。

```json
{
    "type": "object",
    "properties": {
        "presets": {
            "type": "array"
        }
    },
    "additionalProperties": true
}
```

`additionalProperties`为`true`，即允许添加额外参数。

##### emitFile

实现`resource-loader`，用于处理`type: 'asset/resource'`的资源。借助于`raw-loader`，使输入的`content`为`buffer`。

```typescript
const loaderUtils = require('loader-utils');

// 这样输入的content就是buffer，用于处理其他资源
module.exports.raw = true;
module.exports = function (content) {
    // 1.生成带有hash值的文件名
    let filename = loaderUtils.interpolateName(this, 'static/media/[hash].[ext][query]', {
        content,
    });
    // 2.输出文件
    this.emitFile(filename, content);
    // 3.返回module.exports = '文件名'
    return `module.exports = ${filename}`
}
```

### 原理-plugin

#### Tapable

`webpack`编译过程是一条流水线，会触发一系列的`Tapable`钩子事件。

插件的实现，就是寻找相应的钩子，在上面挂上自己的任务，即注册事件。

`Tapable`暴露了三个方法用于注册事件。

1. `tap`：注册同步或异步钩子。
2. `tapAsync`：回调函数方式的异步钩子。
3. `tapPromise`： `Promise`方式的异步钩子。

#### compiler、compilation

##### compiler

`compiler`对象保存着完整的`webpack`环境配置。每次启动`webpack`构建时它都是独一无二的，仅仅创建一次。它暴露了一系列生命周期钩子，允许插件在其各个阶段进行干预。

##### compilation

`compilation`对象则代表着一次完整的模块编译过程。每个`compilation`都是针对一组模块及其依赖关系而创建的。`compilation`对象包含了当前所有模块的信息，并且管理着从加载模块、解析模块依赖到最终输出资源的所有步骤，这些步骤包括但不限于：模块的加载、优化、分块、哈希计算和资源生成。`compilation`也提供了众多的生命周期钩子，供插件在编译的不同阶段插入自定义逻辑。

<div style="width:80%"><img style="border:2px solid #42b883" src=".\compiler和compilation.png"></div>

上图也展示出`webpack`就是一条流水线。

每一个插件必然包含构造函数`constructor(){}`与`apply(compiler){}`方法。

1. `webpack`加载`webpack.config.js`中所有的配置。调用`constructor`实例化插件。
2. `webpack`创建`compiler`对象。
3. 遍历所有`plugins`中插件，调用插件的`apply`方法。
4. 开始编译流程，触发`hooks`。

#### debug

运行`webpack`时加上`--inspect-brk`参数以开启`Node.js`调试器支持。

```shell
node --inspect-brk ./node_modules/webpack/bin/webpack.js --config webpack.config.js
```

#### 钩子类型

钩子的类型有：

1. 同步，如`environment`。
2. 异步串行（`AsyncSeriesHook`，按照注册顺序执行），如`emit`。
3. 异步并行（`AsyncParallelHook`，同时执行，结果根据执行快慢依次输出），如`make`。

#### 开发举例

##### cleanWebpackPlugin

钩子`emit`：输出`asset`到`output`目录之前执行。

```javascript
const path = require('path');
class CleanWebpackPlugin {
    constructor() { };
    apply(compiler) {
        compiler.hooks.emit.tap('CleanWebpackPlugin', () => {
            // 1.获取输出的目录
            const fs = compiler.outputFileSystem;
            // webpack执行到此时，才得到输出路径
            const path = compiler.outputPath;
            // 2.文件处理使用内置的outputFileSystem
            removeDirectoryRecursive(fs, path);
        });
    }
}
function removeDirectoryRecursive(fs, dirPath) {
    // 首先读取目录内容
    const files = fs.readdirSync(dirPath);
    for (const file of files) {
        const filePath = path.join(dirPath, file);
        const stats = fs.statSync(filePath);
        if (stats.isFile()) {
            // 如果是文件，则直接删除
            fs.unlinkSync(filePath);
        } else {
            // 如果是子目录，则递归删除
            removeDirectoryRecursive(fs, filePath);
        }
    }
    // 当子目录及文件都删除后，删除空的父目录
    fs.rmdirSync(dirPath);
}
module.exports = CleanWebpackPlugin;
```