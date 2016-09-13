var path = require('path');

module.exports = {
     outputPath: path.join(__dirname,'../','dist'),
     buildPath:path.join(__dirname),
     // publicPath:'http://public.chendi.cn/webpack/project/dist/',
     publicPath:__HOT__?'http://localhost:9090/':'[your dist host]',//like 'http://public.chendi.cn/webpack-project1/dist/',
     sourcePath: path.join(__dirname,'../','src'),
     cachePath: path.join(__dirname,'../','.cache'),
     libPath: path.join(__dirname,'../src','lib'),
     vendors:['react','react-router','redux','react-dom','react-redux'],
     manifestPath:path.join(__dirname,'./dllconfig'),
     entry:'**/index.@(jsx|js)',
     node_module_path:path.join(__dirname,'../','node_modules'),
     port:9090,
     babelrcdll:path.join(__dirname,'./.babelrc-dll'),
     babelrchot:path.join(__dirname,'./.babelrc-hot'),
     babelrc:path.join(__dirname,'./.babelrc'),
     extensions:['','.js','.jsx'],
     dataurlLimit:8000,
     alias:{
          'jquery':path.join(__dirname,'../','node_modules','@ganji/zepto/zepto.js'),
          // 'react':path.join(__dirname,'../','node_modules')+'/react/react.js', 
          // 'react-dom':path.join(__dirname,'../','node_modules')+'/react-dom/index.js',
          // 'react-router': path.join(__dirname,'../','node_modules') + '/react-router/lib/index.js',
          // 'react-redux': path.join(__dirname,'../','node_modules') + '/react-redux/lib/index.js',
          // 'redux': path.join(__dirname,'../','node_modules') + '/redux/lib/index.js',
          // 'redux-thunk': path.join(__dirname,'../','node_modules') + '/redux-thunk/lib/index.js',
     },
     logconfig:{
          "none":true,// (or false) output nothing
          "errors-only":true,// only output when errors happen
          "minimal":true,// only output when errors or a new compilation happen
          "verbose":true,// output all the information webpack has
          "timings":true,// add timing information
          "chunks":false,// add chunk information (setting this to false allows for a less verbose output)
          "colors":true,
     },
     // devtool:"#source-map",
     devtool:"#cheap-module-eval-source-map",
     provide:{
          $:'jquery'
     }
};