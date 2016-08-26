var path = require('path');
var glob = require('glob');

var Helper =  function(options){
    if(!(this instanceof Helper)){
        return new Helper(options);
    }
    this.options = options||{};
    this.entry = [];
    this.context = options.sourcePath;
    this.libPath = options.libPath?options.libPath.indexOf('.')===0?path.join(this.context,options.libPath):options.libPath:options.libPath;
}
Helper.prototype.findEntry = function(){
    if(Object.prototype.toString.call(this.options.entry)==='[object Array]'){
        return this.options.entry.map(function(file){return file;}.bind(this));
    }
    return glob.sync(path.join(this.context,this.options.entry),{}).map(function(file){return './'+path.relative(this.context,file);}.bind(this));
};
Helper.prototype.findLib = function(){
    if(!this.libPath)return [];
    return glob.sync(path.join(this.libPath,'**/*.@(js|jsx)'),{}).map(function(file){return './'+path.relative(this.context,file);}.bind(this));
}
Helper.prototype.findEntryFile = function(file){
    return glob.sync(path.join(this.context,file+'.*'));
}
Helper.prototype.findFileEntry = function(file){
    var dir = path.dirname(file);
    if(dir===this.context || dir === file){
        return [];
    }
    var entry = glob.sync(path.join(dir,'/'+path.basename(this.options.entry)),{}).map(function(file){return path.relative(this.context,file);}.bind(this));
    if(entry.length===0){
        return this.findFileEntry(dir);
    }else{
        return entry;
    }
}
module.exports = Helper;