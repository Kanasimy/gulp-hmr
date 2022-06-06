const path = require('path');
const webpack = require('webpack');
PATH_DEV = 'http://localhost:3000';
//PATH_BUILD = './dist/assets/'

module.exports = {
    mode: 'development',
    watch: true,
    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client?PATH_DEV',
        './dist/assets/js/main.js',
        './dist/assets/css/main.min.css',
    ],
    output: {
        filename: 'main.js',
        path: path.join(__dirname, 'dist/js/'),
        publicPath: 'PATH_BUILD'
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']
            },
        ]
    },
    devServer: {
        static: './dist/',
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ],
    target: 'web'
};

