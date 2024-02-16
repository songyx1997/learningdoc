<table>
    <tr>
        <td>title：typescript</td>
        <td>author：songyx</td>
        <td>date：2024/02/15</td>
    </tr>
</table>

#### 类型

##### unknown

`unknown`是类型安全的`any`，不能直接赋值给其他变量。

```typescript
let e: unknown;
let s: string;
e = 'hello';
// 1.判断类型
if (typeof e === 'string') {
    s = e;
}
// 2.类型断言
s = e as string;
```

##### 类型断言

存在两种写法

```typescript
s = e as string;
s = <string>e;
```

##### void、never

前者表示空值，后者表示没有值（不能是任何值）。

```typescript
function fun(): void {
    return undefined;
}
function error(): never {
    throw 'error';
}
```

##### 类型推断

当类型没有给出，`ts`编译器会自动推断类型。若无法推断出类型，则视为动态`any`类型。

```typescript
// 推断出a为number类型
let a = 1;
// 编译错误
a = 'hello';
```

##### 元组

元组就是固定长度的数组，可以使用数组的解构赋值。

```typescript
let a = [1, 'hello', 'yes'];
let [num, ...strs] = a;
```

##### enum

使用枚举，便于统一修改，同时增强了代码可读性。

```typescript
enum Gender {
    Male = 1,
    Female = 0
}
// &表示person需要同时满足
let person: { name: string } & { gender: Gender };
person = { name: 'songyx', gender: Gender.Male };
```

##### 类型别名

```typescript
type letter = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G';
// 编译通过
let str1: letter = 'A';
// 编译错误
let str2: letter = 'H'
```

#### 编译选项

##### 严格模式

要启用严格模式，可以在代码的顶部或函数体的开头添加以下语句：

```javascript
"use strict";
```

严格模式的特点包括：

1. 变量必须先声明后使用。
2. 禁止使用`delete`操作符。
3. 禁止对只读属性进行赋值。
4. 禁止使用八进制字面量。
5. 函数内部的`this`值不再是全局对象，而是`undefined`。除非通过`call、apply、bind`明确指定。
6. 禁止使用重复的函数参数名。
7. 禁止使用with。
8. 限制 eval 和 arguments 的赋值。

当`js`文件内存在模块化导入/暴露语句时，该文件自动变成严格模式。

##### 基础配置

```json
{
    // 指定哪些文件需要被编译
    // **表示任意目录
    // *表示任意文件
    "include": [
        "./src/**/*"
    ],
    // 默认值包括node_modules
    "exclude": [],
    // 编译器选项
    "compilerOptions": {
        // 指定编译出的js版本
        // ESNext表示永远指向下一个版本
        "target": "ES5",
        // 模块化规范
        "module": "CommonJS",
        // 编译后文件所在目录
        "outDir": "./dist",
        // 所有的全局作用域中的代码会合并到一个文件中
        // "outFile": "./dist/app.js"
        // 是否编译目录下的js文件
        "allowJs": true,
        // 是否检查js代码是否符合语法规范
        "checkJs": false,
        // 是否移除注释
        "removeComments": true,
        // 当存在错误时不生成编译后的文件
        "noEmitOnError": true,
        // 所有严格检查的总开关，包括以下四项
        "strict": true,
        // 是否将编译后的文件指定为严格模式
        // "alwaysStrict": true,
        // 不允许隐式的any类型
        // "noImplicitAny": true,
        // 不允许不明确类型的this
        // "noImplicitThis": true,
        // 严格检查空值
        // "strictNullChecks": true
    }
}
```

#### webpack

##### 依赖

1. `webpack、webpack-cli`
2. `typescript`
3. `ts-loader`（将`typescript`整合进`webpack`） 

##### 插件

1. `html-webpack-plugin`（根据模板创建`html`文件，并引入编译好的`ts`文件）
2. `clean-webpack-plugin`（`webpack`每次编译时，清除之前编译好的文件）

##### babel

`webpack`将`ts`编译为`js`，需要引入`babel`将编译好的`js`处理成指定的`js`版本，涉及依赖如下：

1. `@babel/core`
2. `@babel/preset-env`（指定环境，如`ie11、chrome88`）
3. `babel-loader`（将`babel`整合进`webpack`。注意加载器的执行顺序为从下往上，因此需要将其放在`ts-loader`之前）
4. `core-js`（如：当需要在老版本`js`中使用`Promise`时，可以从`core-js`中取出`Promise`源码）

##### 必要配置

```javascript
const path = require('path');
// 引入html插件
const HTMLWebpackPlugin = require('html-webpack-plugin');
// 引入清除插件
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    // 入口文件
    entry: './src/index.ts',
    // 输出路径及文件名
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
        environment: {
            // 编译结果不使用箭头函数
            arrowFunction: false
        }
    },
    // 需要使用的模块
    module: {
        // 指定加载的规则
        rules: [
            {
                // 规则生效的文件（这里是所有ts结尾的文件）
                test: /\.ts$/,
                exclude: '/node_modules',
                // 注意：加载器的执行顺序为从后往前
                use: [
                    {
                        loader: 'babel-loader',
                        // 设置babel
                        options: {
                            // 设置预定义的环境
                            presets: [
                                [
                                    // 指定环境的插件
                                    '@babel/preset-env',
                                    // 配置信息
                                    {
                                        targets: {
                                            // 兼容的浏览器版本
                                            'ie': '11'
                                        },
                                        // 指定的corejs版本
                                        'corejs': '3',
                                        // 使用corejs的方式：按需加载
                                        'useBuiltIns': 'usage'
                                    }
                                ]
                            ]
                        }
                    },
                    'ts-loader'
                ]
            }
        ]
    },
    // 设置引用模块（设置哪些文件可以作为模块使用）
    resolve: {
        extensions: ['.ts', '.js']
    },
    // 配置插件
    plugins: [
        new HTMLWebpackPlugin({
            template: './src/index.html'
        }),
        new CleanWebpackPlugin()
    ]
}
```