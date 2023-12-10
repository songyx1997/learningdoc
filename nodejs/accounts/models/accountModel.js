const mongoose = require('mongoose');

// 创建文档属性以及属性值类型
let accountSchema = new mongoose.Schema({
    message: {
        type: String,
        require: true
    },
    date: {
        type: Date,
        require: true
    },
    type: {
        type: Number,
        require: true
    },
    amount: {
        type: Number,
        require: true,
        default: 0
    },
    remark: String
});

// 创建模型对象
let accountModel = mongoose.model('accounts', accountSchema);

module.exports = accountModel;