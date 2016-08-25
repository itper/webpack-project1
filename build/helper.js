var path = require('path');
var glob = require('glob');

var Helper =  function(options){
    if(!(this instanceof Helper)){
        return new Helper(options);
    }
    options = options||{};
    this.entry = [];
    this.context = options.context;
    this.libPath = options.libPath?options.libPath.indexOf('.')===0?path.join(this.context,options.libPath):options.libPath:options.libPath;
}
Helper.prototype.findEntry = function(){
    return glob.sync(path.join(this.context,'**/index.@(js|jsx)'),{}).map(function(file){return './'+path.relative(this.context,file);}.bind(this));
};
Helper.prototype.findLib = function(){
    if(!this.libPath)return [];
    return glob.sync(path.join(this.libPath,'**/*.@(js|jsx)'),{}).map(function(file){return './'+path.relative(this.context,file);}.bind(this));
}
Helper.prototype.findEntryFile = function(file){
    return glob.sync(path.join(this.context,file+'.*'));
}
module.exports = Helper;