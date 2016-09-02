const webpack = require('webpack');
const options = require('../config.js');
const Helper = require('./helper')(options);
const path = require('path');

function compiler(){

}







compiler.getDllCompiler = function (){
    var config = Helper.createDllConfig();
    var compiler = webpack(config);
    return compiler;
};
compiler.getDevCompiler = function(){
    var config = require('./webpack.config')(options);
    config.entry={};
    Helper.findEntry().map(function(v){
        var chunk = path.parse(v).dir+'/'+path.parse(v).name;
        config.entry[chunk] = './'+v;
        return chunk;
    });
    config.init();
};
compiler.getGlobalCompiler = function(){
    var config = Helper.createGlobalConfig();
    console.log(config);
    var compiler = webpack(config);
    return compiler;
};
compiler.getCompiler = function(target){
    var config = Helper.createConfig(target);
    var compiler = webpack(config);
    return compiler;
};
module.exports = compiler;