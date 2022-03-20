// 引入express
const express = require('express')
const { request } = require('http')

// 创建应用对象
const app = express()

// request、response分别为请求、响应报文的封装
app.get('/', (request, response) => {
    response.send('Hello')
})

// 监听端口启动服务
app.listen(8000, () => {
    console.log('服务已启动')
})