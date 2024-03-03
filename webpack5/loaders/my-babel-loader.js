const schema = require('./schemas/my-babel-schema.json');
const babel = require('@babel/core');

// 异步loader
module.exports = function (content) {
    // 获取配置的预设
    let options = this.getOptions(schema);
    // transform为异步方法，创建回调函数
    let callback = this.async();
    babel.transform(content, options, function (err, result) {
        if (err) {
            callback(err);
        } else {
            callback(null, result.code);
        }
    });
    return content;
}