import webpack from 'webpack'

export default config => {
    config.plugins.push(
        new webpack.DefinePlugin({
            'process.env': {
                'SERVER_URL': JSON.stringify('https://mvpreedxy0.execute-api.eu-central-1.amazonaws.com/dev'),
            },
        })
    )
}
