/**
 * 校验是否登录
 */
const checkLogin = (req, res, next) => {
    if (!req.session.username) {
        res.redirect('/login');
    } else {
        next();
    }
}

module.exports = {
    checkLogin: checkLogin
}