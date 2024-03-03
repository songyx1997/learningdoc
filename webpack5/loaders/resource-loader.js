const loaderUtils = require('loader-utils');

// 这样输入的content就是buffer，用于处理其他资源
module.exports.raw = true;
module.exports = function (content) {
    // 1.生成带有hash值的文件名
    let filename = loaderUtils.interpolateName(this, 'static/media/[hash].[ext][query]', {
        content,
    });
    // 2.输出文件
    this.emitFile(filename, content);
    // 3.返回module.exports = '文件名'
    return `module.exports = ${filename}`
}