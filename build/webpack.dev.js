var path = require('path');
var webpack = require('webpack');
var options = require('./config.js');
var Helper = require('./helper')(options);
var Watchpack = require("watchpack");
var envArgs = process.argv;
var targetGlobal = envArgs.indexOf('--global')!==-1;
var force = envArgs.indexOf('--force')!==-1;
var watch = envArgs.indexOf('--watch')!==-1;
var target = envArgs.indexOf('--target')!==-1;
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
function forceUpdate(){
    webpack(require('./webpack.dll.config')(options)).run(function(err,stats){
        // console.log(stats.toString({colors:true}));
        console.log('dll error: '+err);
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
    config.entry[target] = Helper.findEntryFile(target)[0];
    config.init();
}
function run(config){
    webpack(config).run(function(err,stats){
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