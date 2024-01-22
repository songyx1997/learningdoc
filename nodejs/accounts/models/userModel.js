const mongoose = require('mongoose');

// 创建文档属性以及属性值类型
let userSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
});

// 创建模型对象
let userModel = mongoose.model('users', userSchema);

module.exports = userModel;