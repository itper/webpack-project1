var path = require('path');

module.exports = {
     outputPath: path.join(__dirname,'../','dist'),
     buildPath:path.join(__dirname),
     // publicPath:'http://public.chendi.cn/webpack/project/dist/',
     publicPath:__HOT__?'http://localhost:9090/':'http://public.chendi.cn/webpack-project1/dist/',
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
     alias:{
          // 'react':path.join(__dirname,'../','node_modules')+'/react/react.js',
          // 'react-dom':path.join(__dirname,'../','node_modules')+'/react-dom/index.js',
          // 'react-router': path.join(__dirname,'../','node_modules') + '/react-router/lib/index.js',
          // 'react-redux': path.join(__dirname,'../','node_modules') + '/react-redux/lib/index.js',
          // 'redux': path.join(__dirname,'../','node_modules') + '/redux/lib/index.js',
          // 'redux-thunk': path.join(__dirname,'../','node_modules') + '/redux-thunk/lib/index.js'
     },
     logconfig:{
          "none":true,// (or false) output nothing
          "errors-only":true,// only output when errors happen
          "minimal":true,// only output when errors or a new compilation happen
          // "normal":true,// (or true) standard output
          "verbose":true,// output all the information webpack has
          // "context":true,// (string) context directory for request shortening
          // "hash":true,// add the hash of the compilation
          // "version":true,// add webpack version information
          "timings":true,// add timing information
          // "assets":true,// add assets information
          "chunks":false,// add chunk information (setting this to false allows for a less verbose output)
          // "chunkModules":true,// add built modules information to chunk information
          // "modules":true,// add built modules information
          // "children":true,// add children information
          // "cached":true,// add also information about cached (not built) modules
          // "reasons":true,// add information about the reasons why modules are included
          // "source":true,// add the source code of modules
          // "errorDetails":true,// add details to errors (like resolving log)
          // "chunkOrigins":true,// add the origins of chunks and chunk merging info
          // "modulesSort":true,// (string) sort the modules by that field
          // "chunksSort":true,// (string) sort the chunks by that field
          // "assetsSort":true,// (string) sort the assets by that field
          "colors":true,
     },
     // url-loader-limit:8000
     //entry:['./0/1-1/index.js','./0/2-3/index.js'],
     // devtool:"#source-map",
     devtool:"#cheap-module-eval-source-map",
};