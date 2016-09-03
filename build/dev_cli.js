#!/usr/bin/env node
global.__DEV__ = global.__HOT__ =true;
var program = require('commander');
var path = require('path');
var c = require('colors');
const spinner = require('ora')('');
var fs = require('fs-extra');

function getVersion(){
    var p = require(path.join(__dirname,'../','package.json'));
    return p.version;
}

!function initOptions(){
    program.version(getVersion())
    .option('--global','')
    .option('--target','')
    .option('-p,--port <n>','',parseInt)
    .option('-t,--target ')
    .option('--watch','');
    
}();

program.command('build')
        .action(function(target){
            __HOT__ = false;
            var core = require('./core');
            var config = require('./config.js');
            spinner.start();
            if(typeof target==='string'){
                core.buildEntry(target,function(){
                    spinner.stop();
                });
            }else{
                console.log(c.red('参数错误 build [target]'));
                spinner.stop();
            }
        });
program.command('buildDll')
        .action(function(){
            __HOT__ = false;
            var core = require('./core');
            var config = require('./config.js');
            spinner.start();
            core.buildDll(function(){
                spinner.stop();
            });
        });
program.command('buildAll')
        .action(function(){
            __HOT__ = false;
            var core = require('./core');
            var config = require('./config.js');
            spinner.start();
            core.build(function(){
                spinner.stop();
            });
        });
program.command('dev')
        .action(function(target){ 
            __HOT__ = true;
            var core = require('./core');
            var config = require('./config.js');
            spinner.start();
            if(typeof target==='string'){
                core.runDevServer(target);
            }else{
                console.log(c.red('参数错误 build [target]'));
                spinner.stop();
            }
        });
program.command('create')
    .action(function(target){
            var config = require('./config.js');
        var p = path.join(config.sourcePath,target);
        fs.mkdirs(p,function(e){
            if(e){
                console.log(c.red(e));
            }else{
                fs.writeFileSync(path.join(p,'index.html'),fs.readFileSync(config.buildPath+'/template/index.html').toString().replace('{{title}}',target),'utf8');
                fs.writeFileSync(path.join(p,'index.js'),'','utf8');
            }
        });
    });
program.parse(process.argv);