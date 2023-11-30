const express = require('express');
const app = express();

// get请求
app.get('/test', (req, rsp) => {
    rsp.end('test');
});

// post请求
app.post('/login', (req, rsp) => {
    rsp.end('login');
});

// 所有请求，且请求条件为通配符
app.all('*', (req, rsp) => {
    rsp.end('404 NOT FOUND');
});

// 设置端口号，启动服务
app.listen(10086, () => {
    console.log('启动！')
});