var path = require('path');
var HashedModuleIdsPlugin = require('./HashedModuleIdsPlugin');
var webpack = require('webpack');
var glob = require('glob');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var __DEV__ = process.env.NODE_ENV!=='production';

function getConfig(opt){

    var outputPath = opt.outputPath;
    var sourcePath = opt.sourcePath;
    var cachePath = opt.cachePath;

    var Helper = require('./helper')(opt);

    var config = {
        context:opt.sourcePath,
        output:{
            publicPath:opt.publicPath,
            path:opt.outputPath,
            filename:'[name].[chunkhash].js',
            chunkFilename:'chunk-[name].[chunkhash].js'
        },
        module:{

        },
    };
    var entry = config.entry = {};
    var plugins = config.plugins = [
    ];
    config.init = function(){
        var manifest = glob.sync('./*.manifest.json');
        var other = '';
        manifest.map(function(j){
             other+='<script src="'+opt.publicPath+(require(j).name.replace('_','.')+'.js')+'"></script>';
        });
        for(var e in this.entry){
            config.plugins.push(
              new HtmlwebpackPlugin({filename: path.dirname(e)+'/index.html',chunks: [e],template: opt.sourcePath + '/'+ e+'.html'})
            );
        }
        plugins.push(function() {
          this.plugin('compilation', function(compilation) {
            compilation.plugin('html-webpack-plugin-after-emit', function(file, callback) {
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
        loader:'babel',
        query:{
            presets:['es2015','react'],
            cacheDirectory:opt.cacheDirectory
        }
    });
    loaders.push({
        test:/\.(css|scss)$/,
        loaders:['style','css','postcss','sass'],
        exclude:/node_modules/
    });
    loaders.push({
        test:/\.(?:jpg|gif|png|svg)$/,
        loaders:[
            'url-loader?limit=8000&name=img/[hash].[ext]',
            'image-webpack'
        ]
    });
    plugins.push(new HashedModuleIdsPlugin());
    plugins.push( new webpack.DllReferencePlugin({context:__dirname,manifest:require('./vendor.manifest.json')}));
    if(opt.libPath){
        plugins.push( new webpack.DllReferencePlugin({context:__dirname,manifest:require('./lib.manifest.json')}));
    }
    if(__DEV__){
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