<table>
    <tr>
        <td>title：nodejs</td>
        <td>author：songyx</td>
        <td>date：2023/08/30</td>
    </tr>
</table>
#### 注意事项

1. `Node.js`中不能使用`BOM`和`DOM`的`API`，可以使用`console`和定时器`API`。
2. `Node.js`中的顶级对象为`global`，也可以使用`globalThis`访问。

#### buffer

```javascript
// 安全创建
// <Buffer 00 00 00 00 00>
let buf1 = Buffer.alloc(5);
// 非安全创建，可能会包含之前的内存数据
// <Buffer f0 86 82 00 00>
let buf2 = Buffer.allocUnsafe(5);
// 操作、溢出
// 当前为<Buffer c8 c8 c8>
let buf3 = Buffer.from([200, 200, 200]);
// 舍弃高位，仅保留8位。0001 0110 1001（十进制为361）=> 0110 1001（十六进制为69，十进制为105）
buf3[0] = 361;
// 修改后为<Buffer 69 c8 c8>
```

#### fs

##### 写入

异步写入

```javascript
// 路径、内容、配置（可选）、回调函数
fs.writeFile('./word.txt', 'my', error => {
    // 失败返回错误对象，成功返回null
    console.log(error);
});
```

异步追加

```javascript
fs.appendFile('./word.txt', '\r\nname', error => {
    console.log(error);
});

fs.writeFile('./word.txt', '\r\nis', { flag: 'a' }, error => {
    console.log(error);
});
```

同步写入、追加

```javascript
// 路径、内容、配置（可选），无回调函数
fs.writeFileSync('./word.txt', '\r\nname');
fs.appendFileSync('./word.txt', '\r\n777');
```

流式写入：适用于写入频繁的场景

```js
let ws = fs.createWriteStream('./word.txt');

ws.write('my\r\n');
ws.write('name');
// 可选事件
ws.close();
```

##### 读取

异步读取

```js
// 路径、配置（可选）、回调函数
fs.readFile('./word.txt', (error, data) => {
    if (!error) {
        // data为Buffer
        console.log(data.toString());
    }
})
```

流式读取

```javascript
let rs = fs.createReadStream('./word.txt');

// 绑定事件，每次读取内容最大为65536字节（64KB），减少内存空间占用
rs.on('data', chunk => {
    // 依然为Buffer
    console.log(chunk.toString());
})

// end，可选事件
rs.on('end', () => {
    console.log('read is over');
})
```

**使用流式写入和流式读取，理想状态下只需要64KB的空间，占用的内存空间更小。**

由于读取流速度更快，会出现排队现象，使用管道会更快。

```javascript
let rs = fs.createReadStream('./word.txt');
let ws = fs.createWriteStream('./word2.txt');
rs.pipe(ws);
```

##### 重命名、移动文件

```javascript
// 旧路径、新路径、回调函数
fs.rename('./word.txt', './words/letter.txt', error => {
    console.log(error);
})
```

##### 删除文件

```javascript
fs.unlink('./word.txt', error => {
    if (error) {
        console.log(error);
        return;
    }
    console.log('delete success');
})
```

##### 文件信息

```javascript
fs.stat('./word.txt', (error, data) => {
    if (error) {
        return;
    }
    // 文件信息包括：大小、创建时间、修改时间等
    console.log(data);
})
```

#### path

由于`Node.js`的相对路径是相对于命令行的执行路径的，因此路径操作，常使用以下变量。

```javascript
// 当前文件夹的绝对路径
console.log(__dirname);
// 当前js文件的绝对路径
console.log(__filename);
```

为了使路径分隔符保持统一，使用以下方法。

```javascript
const path = require('path');

// D:\Learn\github\learningdoc\nodejs/index.html
console.log(__dirname + '/index.html');

// D:\Learn\github\learningdoc\nodejs\index.html
// 入参：绝对路径、相对路径...
console.log(path.resolve(__dirname, './index.html'))
// 或者使用path.sep获取当前操作系统的路径分隔符
console.log(path.resolve(__dirname + path.sep + 'index.html'))
```

#### http

##### 启动

```javascript
let http = require('http');

// 创建服务对象
let server = http.createServer((req, res) => {
    // 设置响应头，避免乱码
    res.setHeader('content-type', 'text/html;charset=utf-8');
    // 设置响应体
    res.end('你好！');
});

// 设置端口号，启动服务
server.listen(10086, () => {
    console.log('启动！')
});
```

 浏览器访问`http://localhost:10086/`，网页显示你好。

`HTTP`的默认端口为`80`，HTTPS的默认端口为`443`。

##### 获取请求报文

```javascript
let server = http.createServer((req, res) => {
    // 例如：/search?a=1&b=2
    console.log(req.url);
    // 请求头中的键值将被转换为小写，如User-Agent转换为'user-agent'
    console.log(req.headers);
    res.end('hello');
});
```

##### url

使用`url`模块去提取请求的路径与查询字符串。

```javascript
let server = http.createServer((req, res) => {
    // 请求url为http://localhost:10086/search?a=1&b=2，部分打印结果如下：
    // pathname: '/search'，searchParams: { 'a': '1', 'b': '2'}
    let url = new URL(req.url, 'http://localhost/');
    // 获取请求字符串的value值，需要使用get
    console.log(url.searchParams.get('a'));
    res.end('hello');
});
```

##### 设置响应报文

```javascript
let server = http.createServer((req, res) => {
    res.setHeader('content-type', 'text/html;charset=utf-8');
    // 响应头的设置，可以为任意内容，但必须为英文
    res.setHeader('hihihi!', 'I am full!');
    // write方法持续在响应体中追加文字
    res.write('ok!');
    res.write('兄弟们!');
    res.write('我宣布个事儿!');
    // end方法有且仅有一个
    res.end('我是个XX!');
});
```

响应报文中，也可以传入`html`。

```javascript
let server = http.createServer((req, res) => {
    let dir = path.resolve(__dirname, '../html+css+js/practice/mail/index.html');
    // 读取html文件
    let html = fs.readFileSync(dir);
    res.end(html);
});
```

上述代码，`html`中虽然引入了外部`CSS`文件，但是会失效。

为解决上述问题，搭建静态资源服务器如下：

```javascript
let server = http.createServer((req, res) => {
    // 请求url为http://localhost:10086/mail/index.html，因此url.pathname为/mail/index.html
    let url = new URL(req.url, 'http://localhost/');
    // 拼接得到静态资源所处的文件路径
    let filePath = path.resolve(__dirname, `../html+css+js/practice${url.pathname}`);
    fs.readFile(filePath, (error, data) => {
        if (error) {
            res.statusCode = 404;
            res.end('读取静态资源错误');
            return;
        }
        res.end(data);
    });
});
```

##### 设置MIME类型

`HTTP`可以设置响应头`content-type`来表明响应体的MIME类型，浏览器根据该类型处理资源，优化上述代码：

```javascript
// 常见的mime类型
let mimes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
    '.json': 'application/json',
}
// 获取文件后缀名
let ext = path.extname(filePath);
if (mimes[ext]) {
    if (ext === '.html') {
        // content-type字符集的优先级高于html中<meta charset="UTF-8">元素
        res.setHeader('content-type', `${mimes[ext]};charset=utf-8`);
    } else {
        // 除了html文件，其他类型不需要添加字符集，使用上没有影响
        res.setHeader('content-type', mimes[ext]);
    }
} else {
    // 该设置针对未知的资源类型，浏览器会对响应体进行存储，也就是下载
    res.setHeader('content-type', 'application/octet-stream');
}
```

上述代码只是使开发更加规范。实际上，浏览器具备`mime`嗅探功能，会根据响应结果自动判断类型。

##### 错误处理

```javascript
fs.readFile(filePath, (error, data) => {
    if (error) {
        switch (error.code) {
            case 'ENOENT':
                res.statusCode = 404;
                res.end('<h1>404 NOT FOUND</h1>');
                break;
            default:
                break;
        }
        return;
    }
    res.end(data);
});
```

每个`error`都对应一个错误码，比如`404`的错误码为`ENOENT`。

##### GET、POST

1. `GET`主要用来获取数据，`POST`主要用来提交数据。
2. 参数位置：`GET`带参数请求是将参数缀到`URL`之后，`POST`带参数请求是将参数放到请求体中。
3. 安全性：`POST`相对`GET`安全一些，因为`GET`的参数暴露在地址栏。
4. `GET`请求大小有限制，一般为2K，而POST请求没有大小限制。

#### CommonJS

`Node.js`实现了`CommonJS`模块化规范。

模块化的好处：1. 防止命名冲突、2. 高复用性、3. 高维护性。

##### module.exports、exports

暴露数据存在两种方式。

```javascript
module.exports = {
    fun1: fun1,
    fun2: fun2
}
```

```javascript
exports.fun1 = fun1;
exports.fun2 = fun2;
```

二者存在差异，`module.exports` 可以暴露任意数据。

```javascript
// extra.js
module.exports = 2;

// test.js
let extra = require('./extra.js');
// 2
console.log(extra);
```

上述代码如果使用`exports = 2`，则输出结果为`{}`。

这是因为存在隐式关系：`exports = module.exports = {}`，并且`require`的返回值为目标模块中`module.exports`的值。

##### require

当导入文件夹时，首先检测文件夹下`package.json`文件中`main`属性对应的文件，如果`main`属性不存在，或者`package.json`文件不存在，则会检测文件夹下的`index.js`和`index.json`。若均不满足，则会报错。

`require`导入自定义模块的基本流程：

1. 将相对路径，如./extra.js转为绝对路径，定位目标文件。
2. 缓存检测。
3. 读取目标文件代码。
4. 包裹成一个函数并执行，即自执行函数。
5. 缓存模块的值。
6. 返回`module.exports`的值。

#### npm

##### 初始化

```shell
npm init
```

使用该命令，将创建作者所需的`package.json`文件。

##### 生产依赖、开发依赖

```shell
npm install --save less
```

依赖信息保存在`package.json`中`dependencies`属性。

```shell
npm install --save-dev less
```

依赖信息保存在`package.json`中`devDependencies`属性。

```shell
npm install --save less@1.0.0
```

安装指定版本。

```shell
npm remove less
```

删除依赖。

####  express

##### 路由