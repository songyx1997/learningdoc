<table>
    <tr>
        <td>title：webpack5</td>
        <td>author：songyx</td>
        <td>date：2024/02/24</td>
    </tr>
</table>

#### 基础

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
        filename: 'bundle.js',
    },
    module: {
        rules: [],
    },
    plugins: [],
    mode: 'development'
}
```

注意：`loader`从右到左（或从下到上）地取值(`evaluate`)/执行(`execute`)。

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
    }
}
```

##### 处理less

