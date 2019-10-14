const path = require('path');

const output = {
    path: path.resolve('dist'),
    filename:'app.bundle.js'
};

const entry = path.resolve('./src/app.js');
const rules = [{
    test: /\.js$/,
    exclude: '/node_modules/',
    loader: 'babel-loader',
}];

module.exports = {
    mode: 'development',
    context: path.resolve('./src'),
    entry,
    output,
    module: { rules },
}