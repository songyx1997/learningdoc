<table>
    <tr>
        <td>title：ajax+axios</td>
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

##### config[params]

设置`url`参数。

```javascript
// 请求url为http://localhost:3000/posts?id=1，但这样不符合restful API风格
axios.get('http://localhost:3000/posts', { params: { id: 1 } }).then((value) => {
    document.getElementById('message').innerHTML = JSON.stringify(value.data);
})
```

##### defaults

```javascript
// 默认请求方式
axios.defaults.method = 'GET';
// 默认请求地址，后续使用时可简写
axios.defaults.baseURL = 'http://localhost:3000'
// 默认超时时间
axios.defaults.timeout = 3000;
```

##### 实例对象

当存在两个后端微服务（A、B）时，一些请求需要发送到A，一些请求需要发送到B。

创建出来的实例对象`axios_A`、`axios_B`与`axios`具有几乎一样的功能。

```javascript
const axios_A = axios.create({
    // 对应后端微服务-用户
    baseURL: 'http://localhost:3000/user',
    timeout: 3000
})
const axios_B = axios.create({
    // 对应后端微服务-角色
    baseURL: 'http://localhost:3000/role',
    timeout: 3000
})
```

##### 拦截器

```javascript
// 加载遮罩
let loading = false;

// 请求拦截器
axios.interceptors.request.use((config) => {
    // 每次请求均添加token
    if (config.data) {
        config.data.token = 'songyx';
    }
    // 打开加载遮罩
    this.loading = true;
    return config;
}, (error) => {
    return Promise.reject(error);
});

// 响应拦截器
axios.interceptors.response.use((response) => {
    // 关闭加载遮罩
    this.loading = false;
    // 直接获取返回值，忽略其他返回信息
    return response.data;
}, (error) => {
    return Promise.reject(error);
});
```

若进入了拦截器的异常回调，则返回状态为`rejected`的`Promise`对象，则只需在请求的最后添加`catch`方法，执行`onRejected`回调即可。

```javascript
axios.request({
    method: 'GET',
    url: '/posts/2'
}).then((value) => {
    console.log(value);
}).catch((reason) => {
    alert(reason);
})
```

此外，当存在多个拦截器时，请求拦截器的执行顺序类似于栈，响应拦截器的执行顺序类似于队列。

##### 取消请求

当用户重复发送请求时。首先检测之前的请求是否处理完成，若未完成则取消，发送新请求。

```javascript
let cancel = null;
// 请求单个
btns[0].onclick = () => {
    if (cancel) {
        // 若未处理完成，则取消
        cancel();
    }
    axios.request({
        method: 'GET',
        url: '/posts/2',
        cancelToken: new axios.CancelToken(c => cancel = c)
    }).then((value) => {
        cancel = null;
        console.log(value);
    })
}
```

#### axios源码

为什么`axios`既能当函数使用，也可以当对象使用？

```javascript
// 函数
axios({ method: 'GET', url: '/posts' }).then(value => console.log(value));
```

```javascript
// 对象
axios.request({ method: 'GET', url: '/posts' }).then(value => console.log(value));
axios.get('/posts').then(value => console.log(value));
```

##### 入口

```javascript
const axios = createInstance(defaults);
export default axios
```

##### 创建实例

```javascript
function createInstance(defaultConfig) {
  // 1.调用构造函数，创建实例对象
  const context = new Axios(defaultConfig);
  // 2.创建函数
  const instance = bind(Axios.prototype.request, context);
  // 3.将原型对象内容注入函数，使该函数可以使用原型对象中的全部方法
  utils.extend(instance, Axios.prototype, context, {allOwnKeys: true});
  // 4.将实例对象的属性注入函数，使该函数可以当作对象使用
  utils.extend(instance, context, null, {allOwnKeys: true});
  return instance;
}
```

##### 构造函数

```javascript
constructor(instanceConfig) {
    // 导入默认配置
    this.defaults = instanceConfig;
    // 初始化拦截器
    this.interceptors = {
        request: new InterceptorManager(),
        response: new InterceptorManager()
    };
}
```

并给显式原型添加方法，这样实例对象均可以使用。

```javascript
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  Axios.prototype[method] = function (url, config) {
    // 内部调用request方法
    return this.request(mergeConfig(config || {}, {
      method,
      url,
      data: (config || {}).data
    }));
  };
});
```

方法共有三种类型：

1. `['request'](config)`
2. `['delete', 'get', 'head', 'options'](url, config)`
3. `['post', 'put', 'patch'](url, data, config)`

##### 发送请求、拦截器


拦截器的构造函数及其`use`方法如下。每次调用`use`，就往`handlers`添加`{fulfilled,rejected}`执行对。

```javascript
class InterceptorManager {
  constructor() {
    this.handlers = [];
  }
  use(fulfilled, rejected, options) {
    this.handlers.push({
      fulfilled,
      rejected,
    });
    return this.handlers.length - 1;
  }
}
```
`axios`发送请求其实就是调用`request`方法，该方法是对`Promise`链进行处理。

`dispatchRequest`即发送请求，`undefined`用于占位。因为`Promise`的`resolve`和`reject`是成对出现的。

```javascript
// Axios.prototype.request方法
const chain = [dispatchRequest.bind(this), undefined];
// 添加请求拦截器-unshift。在请求组之前压入请求拦截器，导致实际执行时类似于栈
for (const request of this.interceptors.request.handlers) {
    chain.unshift(request.onResolved, request.onRejected);
}
// 添加响应拦截器-push。在请求组之后放入响应拦截器，导致实际执行时类似于队列
for (const response of this.interceptors.response.handlers) {
    chain.push(response.onResolved, response.onRejected);
}
len = chain.length;
// 创建成功的promise对象，因此调用then方法时，参数config将被传递给chain[i++]。
promise = Promise.resolve(config);
// Promise链全部执行结束
while (i < len) {
    promise = promise.then(chain[i++], chain[i++]);
}
return promise;
```

```javascript
function dispatchRequest(config) {
    const adapter = adapters.getAdapter(config.adapter || defaults.adapter);
    return adapter(config).then(function onAdapterResolution(response) {
        // 省略：对响应进行转换
        return response;
    }
};
```

以`xhr`适配器为例，在其中封装`ajax`请求，并对请求返回结果进行分装。适配器返回为`Promise`对象。

```javascript
// 调用适配器，发送请求
function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url);
        xhr.send(config.data);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let data = JSON.parse(xhr.response);
                    // 组装axios的返回数据
                    resolve({
                        config,
                        data,
                        headers: xhr.getAllResponseHeaders(),
                        request: xhr,
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                } else {
                    reject('发送请求异常')
                }
            }
        }
    })
}
```

##### 取消请求

通过构建内部`Promise`实例，将取消操作暴露出去。

```javascript
Axios.prototype.CancelToken = function (executor) {
    let resolvePromise;
    this.selfPromise = new Promise((resolve, reject) => {
        // 当resolvePromise()执行时，selfPromise将变为成功
        resolvePromise = resolve;
    })
    executor(function () {
        resolvePromise();
    })
}
```

而在适配器中，通过`selfPromise`的状态，确认是否执行`abort`方法。

```javascript
xhr.open(config.method, config.url);
// 如果配置了取消操作
if (config.cancelToken) {
    // 当状态为pending时，then方法一直不会被执行
    // 但是暴露出去的cancel方法一旦执行，就会将状态修改为resolved
    config.cancelToken.selfPromise.then(() => {
        xhr.abort();
    })
}
xhr.send(config.data);
```

##### 总结

`axios`与`Axios`的关系？

1. `axios`通过`createInstance`方法创建。
2. `axios`是通过`bind`函数，修改了`this`指向的`Axios.prototype.request`。
3. `axios`作为对象时，拥有`Axios`原型对象上的全部方法，拥有`Axios`实例的全部属性。

------

`instance`与`axios`的关系？

前者是后者的子集，前者不具备后者后面添加的一些方法。

```javascript
const axios = createInstance(defaults);
axios.Axios = Axios;
axios.CanceledError = CanceledError;
axios.CancelToken = CancelToken;
axios.isCancel = isCancel;
axios.VERSION = VERSION;
axios.toFormData = toFormData;
```

------

整体流程？

<div style="margin:0 auto;width:80%">
    <img src=".\整体流程.png">
</div>

##### 自定义

```javascript
// 构造函数
function Axios(config) {
    this.defaults = config;
    this.interceptors = {
        request: new Interceptor(),
        response: new Interceptor()
    };
}

// 构造函数-拦截器
function Interceptor() {
    this.handlers = [];
}

Interceptor.prototype.use = function (onResolved, onRejected) {
    this.handlers.push({ onResolved, onRejected })
}

// 添加request方法
Axios.prototype.request = function (config) {
    console.log(`发送${config.method}请求`);
    // promise链，undefined用于占位
    let chain = [dispatchRequest, undefined];
    // 添加请求拦截器-unshift
    for (const request of this.interceptors.request.handlers) {
        chain.unshift(request.onResolved, request.onRejected);
    }
    // 添加响应拦截器-push
    for (const response of this.interceptors.response.handlers) {
        chain.push(response.onResolved, response.onRejected);
    }
    let promise = Promise.resolve(config);
    // 依次取出回调函数并执行
    while (chain.length > 0) {
        promise = promise.then(chain.shift(), chain.shift());
    }
    return promise;
}

// 发送请求
function dispatchRequest(config) {
    return xhrAdapter(config).then((value) => {
        // 对响应结果进行处理
        return value;
    }, (reason) => {
        throw reason;
    });
}

// 调用适配器，发送请求
function xhrAdapter(config) {
    return new Promise((resolve, reject) => {
        let xhr = new XMLHttpRequest();
        xhr.open(config.method, config.url);
        // 如果配置了取消操作
        if (config.cancelToken) {
            // 当状态为pending时，then方法一直不会被执行
            // 但是暴露出去的cancel方法一旦执行，就会将状态修改为resolved
            config.cancelToken.selfPromise.then(() => {
                xhr.abort();
            })
        }
        xhr.send(config.data);
        xhr.onreadystatechange = () => {
            if (xhr.readyState === 4) {
                if (xhr.status >= 200 && xhr.status < 300) {
                    let data = JSON.parse(xhr.response);
                    // 组装axios的返回数据
                    resolve({
                        config,
                        data,
                        headers: xhr.getAllResponseHeaders(),
                        request: xhr,
                        status: xhr.status,
                        statusText: xhr.statusText
                    });
                } else {
                    reject('发送请求异常')
                }
            }
        }
    })
}

// 添加get方法
Axios.prototype.get = function (url, config) {
    let newConfig = { ...config, url };
    newConfig.method = 'GET';
    return this.request(newConfig);
}

// 添加post方法
Axios.prototype.post = function (url, data, config) {
    let newConfig = { ...config, url, data };
    newConfig.method = 'POST';
    return this.request(newConfig);
}

// 取消-构造函数，通过构建内部promise对象，将取消操作暴露出去
Axios.prototype.CancelToken = function (executor) {
    let resolvePromise;
    this.selfPromise = new Promise((resolve, reject) => {
        // 当resolvePromise()执行时，selfPromise将变为成功
        resolvePromise = resolve;
    })
    executor(function () {
        resolvePromise();
    })
}

function createInstance(config) {
    // 创建实例
    let context = new Axios(config);
    // 创建函数，并修改request的this指向
    let instance = Axios.prototype.request.bind(context);
    // 给该函数添加get、post方法，并修改this指向
    for (const method of Object.keys(Axios.prototype)) {
        instance[method] = Axios.prototype[method].bind(context);
    }
    // 给函数添加实例内的属性
    for (const element of Object.keys(context)) {
        instance[element] = context[element]
    }
    return instance;
}

export default createInstance();
```