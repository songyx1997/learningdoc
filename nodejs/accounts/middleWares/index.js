const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');
const { secret } = require('../config/token');

/**
 * 校验是否登录，使用session
 */
const checkLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

/**
 * 校验是否登录，使用token
 */
const checkLoginByToken = (req, res, next) => {
    let token = '';
    try {
        token = fs.readFileSync(path.resolve(__dirname, '../log/token')).toString();
    } catch (e) {
        token = '';
    }
    if (!token) {
        console.log('token不存在');
        res.redirect('/login');
    } else {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                console.log('token已过期');
                res.redirect('/login');
            } else {
                // 将用户信息存储至请求头
                req.userInfo = data;
                next();
            }
        })
    }
}

module.exports = {
    checkLogin: checkLogin,
    checkLoginByToken: checkLoginByToken
}