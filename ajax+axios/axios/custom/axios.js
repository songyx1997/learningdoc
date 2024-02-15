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