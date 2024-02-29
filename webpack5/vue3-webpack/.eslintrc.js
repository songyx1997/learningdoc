module.exports = {
    root: true,
    parserOptions: {
        parser: '@babel/eslint-parser'
    },
    env: {
        // 启用node中的全局变量，如globalThis
        node: true
    },
    extends: [
        'plugin:vue/vue3-essential',
        'eslint:recommended'
    ]
}