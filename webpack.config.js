var nodeExternals = require('webpack-node-externals');

module.exports = {
    entry: [ './handler.js' ],
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
