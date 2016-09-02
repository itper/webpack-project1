const path = require('path');
const MemoryFileSystem = require("memory-fs");
const glob = require('glob');
const Koa = require('koa');
const fs = require("fs");
const colors = require('colors');
require('babel-polyfill');
const webpackMiddleware = require('koa-webpack-middleware');


function Server(compiler,config){
    this.config = config;
    var dev = webpackMiddleware.devMiddleware(compiler,{
        noInfo: false,
        quiet: false,

    // switch into lazy mode
    // that means no watching, but recompilation on every request
    // watch options (only lazy: false)
    watchOptions: {
        aggregateTimeout: 300,
        poll: true
    },

    // public path to bind the middleware to
    // use the same as in webpack
    // custom headers
    headers: { "X-Custom-Header": "yes" },
    // options for formating the statistics
    stats: {
        colors: true
    }
    });
    var hot = webpackMiddleware.hotMiddleware(compiler,{});

    this.loadDll(compiler.outputFileSystem);
    this.app = new Koa();
    this.app.use(dev).use(hot);
}
Server.prototype.run = function(){
    this.app.listen(this.config.port,function(){
        console.log(colors.green('running'));
    });
};
Server.prototype.loadDll = function (outputFileSystem){
    var ctx = this;
    outputFileSystem.mkdirpSync(this.config.outputPath);
    var manifest = glob.sync(path.join(__dirname,'../dllconfig','/*.manifest.json'));
    manifest.map(function(j){
        var content = require(j);
        var name = content.name.replace('_','.')+'.js';
        outputFileSystem.writeFileSync(path.join(ctx.config.outputPath,name),fs.readFileSync(path.join(ctx.config.outputPath,name)),'utf8');
    });
}


module.exports = Server;