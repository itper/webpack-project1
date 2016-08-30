var path = require('path');

module.exports = {
     outputPath: path.join(__dirname,'../','dist'),
     publicPath:'http://localhost/dist/',
     sourcePath: path.join(__dirname,'../','src'),
     cachePath: path.join(__dirname,'../','.cache'),
     libPath: path.join(__dirname,'../src','lib'),
     vendors:['react','react-router','redux','react-dom','react-redux'],
     entry:'**/index.@(jsx|js)',
     // url-loader-limit:8000
     //entry:['./0/1-1/index.js','./0/2-3/index.js'],
};