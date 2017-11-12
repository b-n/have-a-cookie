var nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    externals: [nodeExternals()],
    module: {
        rules: [
            {
                enforce: "pre",
                test: /\.js$/,
                exclude: [
                    'node_modules/',
                    /_serverless.*$/
                ],
                use: [{ loader: 'eslint-loader' }]
            },
            {
                test: /\.js$/,
                exclude: [
                    'node_modules/',
                    /_serverless.*$/
                ],
                use: [{ loader: 'babel-loader', }]
            }
        ]
    }
};
