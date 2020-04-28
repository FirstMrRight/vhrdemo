const VueLoaderOptionsPlugin = require('vue-loader-options-plugin')

module.exports = {
    // ... other config
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        js: 'babel-loader', // just list loaders here
                        stylus: [
                            'css-loader',
                            'stylus-loader'
                        ]
                    },
                    postcss: {
                        plugins: [postcss_plugin()] // notice: vue-loader deal with postcss, leave it's config here
                    }
                }
            }
            // ... other rule
        ]
    },
    plugins: [
        new VueLoaderOptionsPlugin({
            babel: { // options for babel-loader, if you don't want `.babelrc`
                presets: ['es2015', 'stage-2'],
                plugins: ['transform-runtime', 'transform-object-rest-spread']
            },
            stylus: { // options for stylus-loader
                default: {
                    use: [nib()], // use nib plugin
                    import: ['~nib/lib/nib/index.styl']
                },
                toContext: true // stylus-loader would find options on loaderContext
            }
        }),
        // .. other plugins
    ]
}
