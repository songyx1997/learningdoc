// 同步loader
// 1.直接返回
// return content;
// 2.借助上下文中的API-callback
module.exports = function (content, sourceMap, meta) {
    let result = '';
    try {
        result = content.replace(/console\.log\(['"](.*)['"]\);?/g, '');
        this.callback(null, result, sourceMap, meta)
    } catch (e) {
        this.callback(e)
    }
}