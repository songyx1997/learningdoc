<table>
    <tr>
        <td>title：nodejs</td>
        <td>author：songyx</td>
        <td>date：2023/08/30</td>
    </tr>
</table>

#### 注意事项

1.Node.js中不能使用BOM和DOM的API，可以使用console和定时器API。

2.Node.js中的顶级对象为global，也可以使用globalThis访问。

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

由于`nodej`的相对路径是相对于命令行的执行路径的，因此路径操作，常使用以下变量。

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

HTTP的默认端口为80，HTTPS的默认端口为443。

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

使用url模块去提取请求的路径与查询字符串。

```javascript
let server = http.createServer((req, res) => {
    // 请求url为http://localhost:10086/search?a=1&b=2，部分打印结果如下：
    // pathname: '/search'，searchParams: { 'a': '1', 'b': '2'}
    let url = new URL(req.url, 'http://localhost:10086/');
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

响应报文中，也可以传入html。

```javascript
let server = http.createServer((req, res) => {
    let dir = path.resolve(__dirname, '../html+css+js/practice/mail/index.html');
    // 读取html文件
    let html = fs.readFileSync(dir);
    res.end(html);
});
```

上述代码，html中虽然引入了外部CSS文件，但是会失效。