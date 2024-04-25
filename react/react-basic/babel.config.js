module.exports = {
    // 预设
    presets: [
        // 智能预设，将最新js编译为es5
        ['@babel/preset-env', {
            targets: {
                // 兼容的浏览器版本
                'ie': '11'
            },
            // 指定的corejs版本
            // 当使用promise时，从corejs内引入promise源码
            corejs: 3,
            // 使用corejs的方式：按需加载
            useBuiltIns: 'usage'
        }],
        '@babel/preset-react',
        '@babel/preset-typescript'
    ],
    plugins: [
        // 减少代码体积
        '@babel/plugin-transform-runtime'
    ]
}