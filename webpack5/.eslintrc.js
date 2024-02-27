module.exports = {
    // 解析选项
    parser: '@typescript-eslint/parser',
    parserOptions: {
        // ES语法版本。若这里指定5，那么代码中使用ES6语法将会报错
        ecmaVersion: 6,
        // ES模块化
        sourceType: 'module',
        // 引入ts配置文件
        project: './tsconfig.json'
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
    plugins: [
        // 引入ts插件
        '@typescript-eslint',
        // 解决动态导入语法错误
        'import'
    ],
    // 继承其他规则（这里继承了eslint、ts的官方规则）
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended'
    ]
}