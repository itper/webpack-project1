var webpack = require('webpack');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
var path = require('path');
module.exports = function(options){
    var helper = require('./helper')(options);
    var vendors = options.vendors;
    var lib ;
    var entry = {vendor:vendors};
    if(options.libPath){
        entry.lib = helper.findLib();
    }
    return {
        context:options.sourcePath,
        output:{
            path:options.outputPath,
            filename:'[name].[chunkhash].js',
            library:'[name]_[chunkhash]',
        },
        entry:entry,
        plugins:[
            new webpack.DllPlugin({path:'[name].manifest.json',name:'[name]_[chunkhash]',context:__dirname}),
            new HashedModuleIdsPlugin()
        ]
    }
}