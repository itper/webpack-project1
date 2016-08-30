var path = require('path');

module.exports = {
     outputPath: path.join(__dirname,'../','dist'),
     publicPath:'http://public.chendi.cn/webpack/project/dist/',
     sourcePath: path.join(__dirname,'../','src'),
     cachePath: path.join(__dirname,'../','.cache'),
     libPath: path.join(__dirname,'../src','lib'),
     vendors:['react','react-router','redux','react-dom','react-redux'],
     entry:'**/index.@(jsx|js)',
     node_module_path:path.join(__dirname,'../','node_modules'),
     alias:{
          'react':path.join(__dirname,'../','node_modules')+'/react/react.js',
          'react-dom':path.join(__dirname,'../','node_modules')+'/react-dom/index.js',
          'react-router': path.join(__dirname,'../','node_modules') + '/react-router/lib/index.js',
          'react-redux': path.join(__dirname,'../','node_modules') + '/react-redux/lib/index.js',
          'redux': path.join(__dirname,'../','node_modules') + '/redux/lib/index.js',
          'redux-thunk': path.join(__dirname,'../','node_modules') + '/redux-thunk/lib/index.js'
     }
     // url-loader-limit:8000
     //entry:['./0/1-1/index.js','./0/2-3/index.js'],
};