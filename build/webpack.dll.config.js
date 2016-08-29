var webpack = require('webpack');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
var path = require('path');
var __DEV__ = process.env.NODE_ENV!=='production';
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
            path:opt.outputPath,
            filename:'[name].[chunkhash].js',
            library:'[name]_[chunkhash]',
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
                    loader:'babel',
                    query:{
                        presets:['es2015','react'],
                        cacheDirectory:opt.cacheDirectory
                    }
                }
            ]
        },
        eslint : {
          configFile: './.eslintrc.json'
        },
        plugins:[
            new webpack.DllPlugin({path:'[name].manifest.json',name:'[name]_[chunkhash]',context:__dirname}),
            new HashedModuleIdsPlugin(),
        ]
    };

    if(__DEV__){
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