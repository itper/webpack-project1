var webpack = require('webpack');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
var path = require('path');
var distPath = path.join(__dirname,'../','dist');
var sourcePath = path.join(__dirname,'../','src');
var helper = require('./helper')({context:sourcePath,libPath:'./lib'});
var vendors = [
    'react',
    'react-dom',
    'redux',
];
console.log(helper.findLib());
var lib = helper.findLib();
module.exports = {
    context:sourcePath,
    output:{
        path:distPath,
        filename:'[name].[chunkhash].js',
        library:'[name]_[chunkhash]',
    },
    entry:{
        vendor:vendors,
        lib:lib
    },
    plugins:[
        new webpack.DllPlugin({path:'[name].manifest.json',name:'[name]_[chunkhash]',context:__dirname}),
        new HashedModuleIdsPlugin()
    ]
}