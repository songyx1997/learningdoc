const path = require('path');

module.exports = {
    entry: './src/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ]
            },
            {
                test: /\.less$/i,
                use: [
                  'style-loader',
                  'css-loader',
                  'less-loader',
                ],
              },
        ],
    },
    plugins: [],
    mode: 'development'
}