var path = require('path');
var webpack = require('webpack');
var config = require('./webpack.config');
var sourcePath = path.join(__dirname,'../','src');
var Helper = require('./helper')({context:sourcePath,libPath:'./lib'});
var Watchpack = require("watchpack");
var envArgs = process.argv;
var targetGlobal = envArgs.indexOf('--global')!==-1;
var force = envArgs.indexOf('--force')!==-1;
var watch = envArgs.indexOf('--watch')!==-1;
var target = envArgs.indexOf('--target')!==-1;
if(force){
    webpack(require('./webpack.dll.config')).run(function(err,stats){
        console.log(stats.toString({colors:true}));
        globalConfig();
        run();
    });
    return;
}
if(targetGlobal){
    globalConfig();
    run();
    return;
}
if(target){
    targetConfig();
    run();
}
function globalConfig(){
    Helper.findEntry().map(function(v){
            var chunk = path.parse(v).dir+'/'+path.parse(v).name;
            config.entry[chunk] = './'+v;
            return chunk;
    });
}
function targetConfig(){
    var target = envArgs[envArgs.indexOf('--target')+1];
    target = path.parse(target).dir+'/'+path.parse(target).name;
    config.entry[target] = Helper.findEntryFile(target)[0];
}
function run(){
    webpack(config).run(function(err,stats){
        console.log(stats.toString({colors:true}));
        if(watch){
        }
    })
}
    var wp = new Watchpack();
    wp.on('change',function(file){
        console.log('change '+file);
    });
    wp.on("aggregated", function(changes) {
        console.log('changes);
    });
    wp.watch(['./webpack.config.js'], [sourcePath], Date.now() - 10000);