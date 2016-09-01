var path = require('path');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
var webpack = require('webpack');
var glob = require('glob');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var __HOT__ = process.argv.indexOf('--hot')!==-1;
var __DEV__ = process.env.NODE_ENV!=='production';
function getConfig(opt){

    var config = {
        context:opt.sourcePath,
        output:{
            publicPath:opt.publicPath,
            path:opt.outputPath,
            filename:__HOT__?'[name].js':'[name].[chunkhash].js',
            chunkFilename:__HOT__?'chunk-[name].js':'chunk-[name].[chunkhash].js'
        },
        module:{
        },
        profile:true,
        stats: {
            hash: true,
            progress:true,
            version: true,
            timings: true,
            assets: true,
            chunks: true,
            modules: true,
            reasons: true,
            children: true,
            source: false,
            errors: true,
            errorDetails: true,
            warnings: true,
            publicPath: true
        },
    };
    var entry = config.entry = {};
    var plugins = config.plugins = [
    ];
    config.init = function(){
        var other = '';
        for(var e in this.entry){
            config.plugins.push(
              new HtmlwebpackPlugin({filename: path.dirname(e)+'/index.html',chunks: [e],template: opt.sourcePath + '/'+ e+'.html'})
            );
        }
        plugins.push(function() {
          this.plugin('compilation', function(compilation) {
            compilation.plugin('html-webpack-plugin-after-emit', function(file, callback) {
                var fs = compilation.compiler.outputFileSystem;
                // if('MemoryFileSystem'===fs.constructor.name){
                //     var dir = fs.readdirSync(opt.buildPath+'/');
                //     for(var j in dir){
                //         j = dir[j];
                //         if(j.indexOf('.manifest.json')>0){
                //             other+='<script src="'+opt.publicPath+(JSON.parse(fs.readFileSync(path.join(__dirname,j))).name+'.js')+'"></script>';
                //         }
                //     }
                // }else{
                    var manifest = glob.sync('./*.manifest.json');
                    var other = '';
                    manifest.map(function(j){
                         other+='<script src="'+opt.publicPath+(require(j).name.replace('_','.')+'.js')+'"></script>';
                    });
                // }
                var htmlSource = file.html.source();
                htmlSource = htmlSource.replace(/(<\/head>)/, other + '$1');
                file.html.source = function() {
                    return htmlSource;
                };
                callback(null,file);
          });
        });
      });
    };
    config.resolve={
        alias: opt.alias
    };
    var loaders = config.module.loaders = [];
    var preLoaders = config.module.preLoaders = [];
    preLoaders.push({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
    });
    config.eslint = {
      configFile: './.eslintrc.json'
    };
    loaders.push({
        test:/\.(js|jsx)$/,
        exclude:/node_modules/,
        include:opt.sourcePath,
        loader:'babel?babelrc=false&extends='+path.join(__dirname,'.babelrc'),
    });
    loaders.push({
        test:/\.(css|scss)$/,
        loaders:['style','css','postcss'],
        exclude:/node_modules/
    });
    loaders.push({
        test:/\.(?:jpg|gif|png|svg)$/,
        loaders:[
            'url-loader?limit=8000&name=img/[hash].[ext]',
            'image-webpack'
        ]
    });
    // loaders.push({

    // });
    plugins.push(new HashedModuleIdsPlugin());
    plugins.push( new webpack.DllReferencePlugin({context:__dirname,manifest:require('./vendor.manifest.json')}));
    if(opt.libPath){
        plugins.push( new webpack.DllReferencePlugin({context:__dirname,manifest:require('./lib.manifest.json')}));
    }
    if(!__DEV__){
        plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress:{

                },
                output:{
                    comments:false
                }
            })
        );
    }
    return config;

}

module.exports = getConfig;