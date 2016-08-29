var path = require('path');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
var webpack = require('webpack');
var WebpackMd5Hash = require('webpack-md5-hash');
var envArgs = process.argv;
var __DEV__ = process.env.NODE_ENV!=='production';

function getConfig(opt){

    var outputPath = opt.outputPath;
    var sourcePath = opt.sourcePath;
    var cachePath = opt.cachePath;

    var Helper = require('./helper')(opt);

    var config = {
        context:opt.sourcePath,
        output:{
            path:opt.outputPath,
            filename:'[name].[chunkhash].js',
            chunkFilename:'chunk-[name].[chunkhash].js'
        },
        module:{

        },
    }
    var entry = config.entry = {};
    var plugins = config.plugins = [
    ];


    var loaders = config.module.loaders = [];
    loaders.push({
        test:/\.(js|jsx)$/,
        exclude:/node_modules/,
        include:opt.sourcePath,
        loaders:['babel?cacheDirectory='+opt.cachePath]
    });
    loaders.push({
        test:/\.(css|scss)$/,
        loaders:['style','css','postcss','sass'],
        exclude:/node_modules/
    });
    loaders.push({
        test:/\.(?:jpg|gif|png|svg)$/,
        loaders:[
            'url-loader?limit=8000&name=img/[hash].[ext]',
            'image-webpack'
        ]
    });
    plugins.push(new HashedModuleIdsPlugin());
    plugins.push( new webpack.DllReferencePlugin({context:__dirname,manifest:require('./vendor.manifest.json')}));
    if(opt.libPath){
        plugins.push( new webpack.DllReferencePlugin({context:__dirname,manifest:require('./lib.manifest.json')}));
    }
    if(!__DEV__){
        plugins.push(
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

module.exports = getConfig;