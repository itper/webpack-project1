var webpack = require('webpack');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
var path = require('path');
var __DEV__ = process.env.NODE_ENV!=='production';
var __HOT__ = process.argv.indexOf('--hot')!==-1;
function getConfig (opt){
    var helper = require('./helper')(opt);
    var vendors = opt.vendors;
    var lib ;
    var entry = {vendor:vendors};
    if(opt.libPath){
        entry.lib = helper.findLib();
    }
    var config =  {
        context:opt.sourcePath,
        output:{
            publicPath:opt.publicPath,
            path:opt.outputPath,
            filename:__HOT__?'[name].js':'[name].[chunkhash].js',
            library:__HOT__?'[name]':'[name]_[chunkhash]',
        },
        entry:entry,
        module:{
            preLoaders:[
                {
                    test: /\.(js|jsx)$/,
                    exclude: /node_modules/,
                    loader: 'eslint-loader'
                }
            ],
            loaders:[
                {
                    test:/\.(js|jsx)$/,
                    exclude:/node_modules/,
                    include:opt.sourcePath,
                    loader:'babel?babelrc=false&extends='+path.join(__dirname,'.babelrc'),
                    // query:{
                    //     presets:['es2015','react'],
                    //     cacheDirectory:opt.cachePath
                    // }
                }
            ]
        },
        profile:true,
        stats: {
            hash: true,
            version: true,
            timings: true,
            assets: true,
            chunks: true,
            modules: true,
            reasons: true,
            children: true,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: true,
            publicPath: true
        },
        eslint : {
          configFile: './.eslintrc.json'
        },
        plugins:[
            new webpack.DllPlugin({path:opt.buildPath+'/'+'[name].manifest.json',name:__HOT__?'[name]':'[name]_[chunkhash]',context:__dirname}),
            new HashedModuleIdsPlugin(),
        ]
    };

    if(!__DEV__){
        config.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress:{

                },
                output:{
                    comments:false
                }
            })
        );
    }
    return config;
}
module.exports = function(opt){
    return getConfig(opt);
}