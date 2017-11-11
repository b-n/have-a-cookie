var nodeExternals = require('webpack-node-externals');
const slsw = require('serverless-webpack');

module.exports = {
    entry: slsw.lib.entries,
    target: 'node',
    devtool: 'source-map',
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
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: [ 'babel-preset-env' ]
                        }
                    }

                ]
            }
        ]
    }
};
