const express = require('express');
const router = express.Router();
const userModel = require('../../models/userModel');
const md5 = require('md5');

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
            // 写入session
            res.session.username = data.username;
            // 将session与用户关联
            res.session._id = data._id;
            rsp.render('success', { 'message': '登录成功', 'url': '/api' });
        } else {
            rsp.send('账号或密码错误！')
        }
    }).catch((e) => {
        throw e;
    })
})

module.exports = router;