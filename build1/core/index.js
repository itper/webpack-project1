global.__DEV__ = global.__HOT__ = true;
const webpack = require('webpack');
const options = require('../config.js');
const Watchpack = require("watchpack");
const WebpackDevServer = require('webpack-dev-server');
const compiler = require('./compiler');
const Server = require('./server');
function core(){

}

core.forceBuild =function(){
};
core.buildEntry = function(cb){
    var cp = compiler.getCompiler();
    cp.run(cb);
};
core.buildAll = function(cb){
    var cp = compiler.getGlobalCompiler();
    cp.run(cb);
};
core.buildDll = function(cb){
    var cp = compiler.getDllCompiler();
    cp.run(function(e,r){
        
    });
};
core.buildAndWatch = function(){
    var wp = new Watchpack();
    wp.on('change',function(file){
        if(file.indexOf(options.libPath)!==-1){
            forceUpdate();
        }
        if(file.toString().indexOf('/')===-1)return;
        this.buildEntry();
    });
    wp.watch([], [options.sourcePath], Date.now() - 10000);
};
core.runDevServer = function(target){
    var cp = compiler.getCompiler(target);
    var server = new Server(cp,options);
    server.run();
};
function devServerForce(config,target){
    var dllCompiler = webpack(require('./webpack.dll.config')(options));
    dllCompiler.plugin("done", function(stats) {
        devServer(config,target);
    });
    dllCompiler.run(function(err,stats){
        console.log(err);
    });
}
function devServer(target){
    var compiler = webpack(config);
    var server = new WebpackDevServer(compiler,{
        hot: true,
        historyApiFallback: true,
    });
    server.listen(options.port);
}
module.exports = core;