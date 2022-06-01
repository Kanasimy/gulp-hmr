const path = require('path');
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    watch: true,
    entry: [
        'webpack/hot/dev-server',
        'webpack-hot-middleware/client',
        './src/index.js'
    ],
    output: {
        filename: 'index.js',
        path: path.join(__dirname, 'dist'),
        publicPath: './dist'
    },
    devServer: {
        static: './dist',
        hot: true,
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
    ]
};

