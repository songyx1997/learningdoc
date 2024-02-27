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

`css-loader`： 会对 `@import` 和 `url()` 进行处理，就像`js` 解析 `import/require()` 一样。

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

<div><img style="border:2px solid #42b883" src=".\runtimeChunk.jpg"></div>

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

#### 项目