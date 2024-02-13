<table>
    <tr>
        <td>title：ajax</td>
        <td>author：songyx</td>
        <td>date：2024/02/11</td>
    </tr>
</table>
#### ajax

`ajax`在进行前后端交互时，最初使用的是`xml`。

优点：

1. 可以无需刷新页面与服务端进行通信。
2. 可以根据用户事件更新部分页面内容。

缺点：

1. 没有浏览历史，不能回退。
2. 存在跨域问题（跨域：从`a.com`往`b.com`发请求）。
3. `SEO`（搜索引擎优化）不友好。

##### readyState

1. 0-未初始化：确认`XMLHttpRequest`对象是否创建，并为调用`open`方法作好准备。
2. 1-载入：调用`open`方法，根据参数`(method, url, true)`完成对象状态的设置。并调用`send`方法开始向服务端发送请求。
3. 2-载入完成：接收服务器端的响应数据。但获得的还只是服务端响应的原始数据，并不能直接在客户端使用。
4. 3-交互：解析接收到的服务器端响应数据。即根据服务器端响应头部返回的`MIME`类型把数据转换成能通过`responseBody`、`responseText`或`responseXML`属性存取的格式，为在客户端调用作好准备。
5. 4-完成：确认全部数据都已经解析为客户端可用的格式，解析已经完成。

##### GET

```javascript
<script>
    let btn = document.getElementById('btn');
    btn.onclick = () => {
        let text = document.getElementById('text').value;
        let xhr = new XMLHttpRequest();
        // 1.open（初始化，设置请求方法与url）
        xhr.open('GET', `http://localhost:10086/server?text=${text}`);
        // 2.发送数据
        xhr.send();
        // 3.处理返回结果
        xhr.onreadystatechange = () => {
            // 请求已完成
            if (xhr.readyState === 4) {
                // 2xx-成功
                if (xhr.status >= 200 && xhr.status < 300) {
                    let data = JSON.parse(xhr.response);
                    alert(data.data);
                }
            }
        }
    }
</script>
```

```javascript
app.get('/server', (req, res) => {
    let { text } = req.query;
    // 解决跨域问题
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        code: 'AAAAAAA',
        msg: '上传成功',
        data: text,
    })
})
```

##### POST

`POST`的处理方式基本和`GET`相同，只是传参有所差异。为了`express`能够获取到参数，需要设置`MIME`类型。

```javascript
// 1.open（初始化，设置请求方法与url）
xhr.open('POST', `http://localhost:10086/server`);
// 设置MIME类型
xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded');
// 2.发送数据
xhr.send(`text=${text}`);
```

```javascript
// 解析POST入参
const bodyParser = require('body-parser');
const urlencodedParser = bodyParser.urlencoded({ extended: false });
app.post('/server', urlencodedParser, (req, res) => {
    let { text } = req.body;
    // 解决跨域问题
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.json({
        code: 'AAAAAAA',
        msg: '上传成功',
        data: text,
    })
})
```

##### 自定义请求头

```javascript
// 自定义请求头
xhr.setRequestHeader('token', 'songyx');
```

##### IE缓存问题

`IE`浏览器会对`ajax`的请求结果进行缓存，通过添加时间戳解决。

```javascript
xhr.open('POST', `http://localhost:10086/server?t=${Date.now()}`);
```

##### 请求超时

```javascript
xhr.timeout = 3000;
xhr.ontimeout = () => {
    alert('请求已超时');
};
```

##### 网络异常

```javascript
xhr.onerror = () => {
    alert('网络异常');
};
```

##### 取消请求

```javascript
let cancel = document.getElementById('cancel');
cancel.onclick = () => {
    xhr.abort();
}
```

##### fetch

```javascript
fetch(`http://127.0.0.1:10086/server?t=${Date.now()}`, {
    method: 'POST',
    headers: {
        // 自定义请求头会导致app.post无法识别
        // name: 'songyx',
        'content-type': 'application/x-www-form-urlencoded',
    },
    body: `text=${text}`
}).then((response) => {
    // 返回值需要借助text方法获取
    return response.text();
}).then((value) => {
    alert(JSON.parse(value).data);
})
```

##### 同源策略

协议、域名、端口号全部相同。

##### jsonp

借助`jsonp`可以实现跨域，仅限于`GET`请求。

实现原理：`<script>`自带跨域特性。

```javascript
<script>
    // 展示请求返回的信息
    function alertText(text) {
        alert(text);
    }

    let btn = document.getElementById('btn');
    btn.onclick = () => {
        let text = document.getElementById('text').value;
        let script = document.createElement('script');
        script.src = `http://127.0.0.1:10086/server?text=${text}`;
        // 将代码追加至document
        document.body.appendChild(script);
    }
</script>
```

```javascript
app.get('/server', (req, res) => {
    let { text } = req.query;
    res.send(`alertText(${text})`);
})
```

##### cors

 借助`cors`（跨域资源共享）可以实现跨域，即设置响应头。

```javascript
// 解决跨域问题
res.setHeader('Access-Control-Allow-Origin', '*');
```

#### axios