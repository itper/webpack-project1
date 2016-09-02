#!/usr/bin/env node

var program = require('commander');
var path = require('path');
var core = require('./core');

function getVersion(){
    var p = require(path.join(__dirname,'../','package.json'));
    return p.version;
}

var target = process.argv[process.argv.indexOf('--target')+1];
target = path.parse(target).dir+'/'+path.parse(target).name;
// core.runDevServer(target);
// core.buildDll();
core.buildAll(function(e,r){
    console.log(r);
});
function initOptions(){
    program.version(getVersion())
    .option('--global','')
    .option('--target','')
    .option('--watch','');
    
}
initOptions();
function get(){
    if(program.global){
        console.log('global');
    }

    if(program.target){
        console.log('target');
    }
    if(program.watch){
        console.log('watch');
    }
}
function runDevServer(){
    program.usage('<cmd> [option]');
    program.command('devServer')
    .description('run dev server')
    .action(function(env){
        console.log('test '+env);
    })
    .on('--help', function() {
        console.log('    $ build');
        console.log('    $ build dev');
        console.log('    $ build prod\n');
    });
}

runDevServer();
program.parse(process.argv);
const ora = require('ora');
// const spinner = ora('loading unicorns').start();
// setTimeout(()=>{
//     spinner.color = 'yellow';
//     spinner.text = 'loading';
// },1);