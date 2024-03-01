const path = require('path');

module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    parserOptions: {
        parser: '@typescript-eslint/parser',
        // ES语法版本。若这里指定5，那么代码中使用ES6语法将会报错
        ecmaVersion: 6,
        // ES模块化
        sourceType: 'module',
        // 引入ts配置文件
        project: path.resolve(__dirname, './tsconfig.json'),
        // 扩展文件
        extraFileExtensions: ['.vue']
    },
    env: {
        // 启用node中的全局变量，如globalThis
        node: true
    },
    // 具体检查规则，优先级高于继承的规则
    rules: {
        // 允许any类型
        '@typescript-eslint/no-explicit-any': 0,
        // 关闭多单词组件名称检查
        'vue/multi-word-component-names': 0
    },
    plugins: [
        // 引入ts插件
        '@typescript-eslint',
        'vue'
    ],
    extends: [
        'plugin:vue/vue3-recommended',
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ]
}