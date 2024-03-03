// remainingRequest表示剩下还需要处理的loader
module.exports.pitch = function (remainingRequest) {
    // 1.将remainingRequest中绝对路径修改为相对路径
    const path = remainingRequest.split('!').map((absolutePath) => {
        return this.utils.contextify(this.context, absolutePath);
    }).join('!');
    // path输出为../../../node_modules/css-loader/dist/cjs.js!./reset.css
    // 2.引入css-loader处理过的资源
    // 创建style，将内容插入页面中生效
    // 使用!!中止后续loader执行
    const script = `
      import style from '!!${path}';
      const styleEl = document.createElement('style');
      styleEl.innerHTML = style;
      document.head.appendChild(styleEl);
    `
    // 3.中止后续loader执行
    return script;
}