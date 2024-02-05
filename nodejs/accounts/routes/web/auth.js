const express = require('express');
const router = express.Router();
const userModel = require('../../models/userModel');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { secret } = require('../../config/token');

router.get('/', (req, res) => {
    res.redirect('/api');
})

router.get('/reg', (res, rsp) => {
    rsp.render('auth/register');
})

router.post('/reg', (res, rsp) => {
    let params = { ...res.body, password: md5(res.body.password) };
    userModel.create(params).then((data) => {
        rsp.render('success', { 'message': '注册成功', 'url': '/login' });
    }).catch((e) => {
        throw e;
    })
})

router.get('/login', (res, rsp) => {
    rsp.render('auth/login');
})

router.post('/login', (res, rsp) => {
    let params = { ...res.body, password: md5(res.body.password) };
    userModel.findOne(params).then((data) => {
        if (data) {
            let obj = { username: data.username, _id: data._id };
            // 配置项，expiresIn（生命周期）单位为秒
            let config = { expiresIn: 60 };
            // 创建token
            let token = jwt.sign(obj, secret, config);
            // 测试用，将toekn写入本地文件
            fs.writeFileSync(path.resolve(__dirname, '../../log/token'), token);
            rsp.render('success', { 'message': '登录成功', 'url': '/api' });
        } else {
            rsp.send('账号或密码错误！')
        }
    }).catch((e) => {
        throw e;
    })
})

module.exports = router;