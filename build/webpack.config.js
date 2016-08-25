var path = require('path');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
var webpack = require('webpack');
var WebpackMd5Hash = require('webpack-md5-hash');
var outputPath = path.join(__dirname,'../','dist');
var sourcePath = path.join(__dirname,'../','src');
var cachePath = path.join(__dirname,'../','.cache');
var envArgs = process.argv;
var Helper = require('./helper')({context:sourcePath,libPath:'./lib'});
var __DEV__ = process.env.NODE_ENV!=='production';


var config = {
    context:sourcePath,
    output:{
        path:outputPath,
        filename:'[name].[chunkhash].js'
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
    include:sourcePath,
    loaders:['babel?cacheDirectory='+cachePath]
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
plugins.push( new webpack.DllReferencePlugin({context:__dirname,manifest:require('./lib.manifest.json')}));
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



























module.exports = config;