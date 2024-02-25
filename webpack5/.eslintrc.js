module.exports = {
    // 解析选项
    parserOptions: {
        // ES语法版本。若这里指定5，那么代码中使用ES6语法将会报错
        ecmaVersion: 6,
        // ES模块化
        sourceType: 'module'
    },
    env: {
        // 启用node中的全局变量，如globalThis
        node: true,
        // 启动浏览器中的全局变量，如console
        browser: true
    },
    // 具体检查规则，优先级高于继承的规则
    rules: {
        // 比如，禁止使用var定义变量
        'no-var': 2
    },
    // 继承其他规则（这里继承了Vue、eslint的官方规则）
    extends: ['plugin:vue/vue3-recommended', 'eslint:recommended']
}