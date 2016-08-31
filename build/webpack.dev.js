var path = require('path');
var MemoryFileSystem = require("memory-fs");
var webpack = require('webpack');
var options = require('./config.js');
var fs = require('fs');
var Helper = require('./helper')(options);
var Watchpack = require("watchpack");
var WebpackDevServer = require('webpack-dev-server');
var envArgs = process.argv;
var targetGlobal = envArgs.indexOf('--global')!==-1;
var force = envArgs.indexOf('--force')!==-1;
var watch = envArgs.indexOf('--watch')!==-1;
var target = envArgs.indexOf('--target')!==-1;
var hot = envArgs.indexOf('--hot')!==-1;
console.log(process.env.NODE_ENV);
if(envArgs.indexOf('--help')!==-1){
    console.log('\nUsage: node webpack.dev.js\n');
    console.log('Options:');
    console.log('--global ');
    console.log('--target ');
    console.log('--watch ');
    return;
}
if(force){
    forceUpdate();
}
if(!hot){
    if(targetGlobal){
        var config = require('./webpack.config')(options);
        config.entry={};
        globalConfig(config);
        run(config);
    }else{
        if(target){
            var config = require('./webpack.config')(options);
            config.entry={};
            targetConfig(config);
            run(config);
        }
    }
}
function forceUpdate(){
    webpack(require('./webpack.dll.config')(options)).run(function(err,stats){
        // console.log(stats.toString({colors:true}));
        console.log('dll error: '+err);
        console.log(stats.toString({colors:true}));
        var config = require('./webpack.config')(options);
        config.entry={};
        globalConfig(config);
        run(config);
    });
}
function globalConfig(config){
    Helper.findEntry().map(function(v){
            var chunk = path.parse(v).dir+'/'+path.parse(v).name;
            config.entry[chunk] = './'+v;
            return chunk;
    });
    config.init();
}
function targetConfig(config){
    var target = envArgs[envArgs.indexOf('--target')+1];
    target = path.parse(target).dir+'/'+path.parse(target).name;
    config.entry[target] = [Helper.findEntryFile(target)[0]];
    config.init();
    return target;
}
function run(config){
    var compiler =webpack(config);
    compiler.run(function(err,stats){
        console.log('chunk error: '+err);
        console.log(stats.toString({colors:true}));
    });
}
function runWatch(){
    var wp = new Watchpack();
    wp.on('change',function(file){
        if(file.indexOf(options.libPath)!==-1){
            forceUpdate();
        }
        if(file.toString().indexOf('/')===-1)return;
        var config = require('./webpack.config')(options);
        config.entry={};
        var t = Helper.findFileEntry(file)[0];
        if(t){
            t = path.parse(t).dir+'/'+path.parse(t).name;
            config.entry[t] = Helper.findEntryFile(t)[0];
            console.log(config);
            run(config);
        }
    });
    wp.on("aggregated", function(changes) {
    });
    wp.watch([], [options.sourcePath], Date.now() - 10000);
}
if(watch){
    runWatch();
}

if(hot){
    devServer();
}
function devServer(config,target){

    var dllCompiler = webpack(require('./webpack.dll.config')(options));
    dllCompiler.plugin("done", function(stats) {
        var config = require('./webpack.config')(options);
        config.entry={};
        var target = targetConfig(config);
        // config.entry[target].unshift("webpack-hot-middleware/client");
        config.entry[target].unshift("webpack-dev-server/client?http://localhost:9090/");
        // config.entry[target].unshift('webpack/hot/only-dev-server');
        // config.module.loaders[0].loaders.unshift('react-hot');
        // console.log(config.module.loaders[0].loaders);
        // config.plugins.push(new webpack.HotModuleReplacementPlugin());
        var compiler = webpack(config);
        var server = new WebpackDevServer(compiler,{
            hot: true,
            historyApiFallback: true,
            
            // contentBase:'http://localhost:9090/dist/app/',
            // publicPath:'/dist/app'
        });
        compiler.outputFileSystem.mkdirpSync(options.outputPath);
        compiler.outputFileSystem.writeFileSync(path.join(options.outputPath,'lib.js'),fs.readFileSync(path.join(options.outputPath,'lib.js'),'utf8'));
        compiler.outputFileSystem.writeFileSync(path.join(options.outputPath,'vendor.js'),fs.readFileSync(path.join(options.outputPath,'vendor.js'),'utf8'));
        server.listen(9090);
        console.log(stats.toString({colors:true}));
    });
    dllCompiler.run(function(err,stats){
        console.log(err);
        console.log('dll123');
    });
}