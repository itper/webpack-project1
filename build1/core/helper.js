var path = require('path');
var glob = require('glob');
var HtmlwebpackPlugin = require('html-webpack-plugin');
var HashedModuleIdsPlugin = require('../plugin/HashedModuleIdsPlugin');
var PreHtmlPlugin = require('../plugin/PreHtmlPlugin');
var webpack = require('webpack');

var Helper =  function(options){
    if(!(this instanceof Helper)){
        return new Helper(options);
    }
    this.options = options||{};
    this.entry = [];
    this.context = options.sourcePath;
    this.libPath = options.libPath?options.libPath.indexOf('.')===0?path.join(this.context,options.libPath):options.libPath:options.libPath;
};
Helper.prototype.findEntry = function(){
    if(Object.prototype.toString.call(this.options.entry)==='[object Array]'){
        return this.options.entry.map(function(file){return file;}.bind(this));
    }
    return glob.sync(path.join(this.context,this.options.entry),{}).map(function(file){return path.relative(this.context,file);}.bind(this));
};
Helper.prototype.findLib = function(){
    if(!this.libPath)return [];
    return glob.sync(path.join(this.libPath,'**/*.@(js|jsx)'),{}).map(function(file){return './'+path.relative(this.context,file);}.bind(this));
};
Helper.prototype.findEntryFile = function(file){
    return glob.sync(path.join(this.context,file+'.@(js|jsx)'));
};
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
};
Helper.prototype.createGlobalConfig = function(){
    var entry = {};
    this.findEntry().map(function(v){
        var chunk = path.parse(v).dir+'/'+path.parse(v).name;
        console.log(v,chunk);
        entry[chunk] = './'+v;
    });
    var config = new Config(entry,this.options);
    return config;
};
Helper.prototype.createConfig = function(target){
    var entry = {};
    entry[target] = [this.findEntryFile(target)[0]];
    var config = new Config(entry,this.options);
    if(__HOT__){
        config.entry[target].unshift("eventsource-polyfill","webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000");
        config.plugins.push(new webpack.HotModuleReplacementPlugin());
    }
    return config;
};
Helper.prototype.createDllConfig = function(target){
    var entry =  this.findLib();
    var config = new DllConfig(entry,this.options);
    return config;
};

var stats={hash: true,progress:true,version: true,timings: true,assets: true,chunks: true,modules: true,reasons: true,
        children: true,source: false,errors: true,errorDetails: true,warnings: true,publicPath: true
    };
function Config(entry,opt){
    this.module = {};
    this.profile = true;
    this.opt = opt;
    this.entry = entry;
    this.plugins = [];
    this.module.loaders = [];
    this.module.preLoaders = [];
    this.resolve = {
        alias: opt.alias
    };
    this.eslint = {
        configFile: __dirname+'/../.eslintrc.json'
    };
    this.stats = stats;
    this.context=opt.sourcePath;
    this.output={
        publicPath:opt.publicPath,
        path:opt.outputPath,
        filename:__HOT__?'[name].js':'[name].[chunkhash].js',
        chunkFilename:__HOT__?'chunk-[name].js':'chunk-[name].[chunkhash].js'
    };
    this.__getPreloader().__getLoader().__getPlugin();
}
Config.prototype.__getPlugin = function(){
    this.plugins.push(new HashedModuleIdsPlugin());
    this.plugins.push( new webpack.DllReferencePlugin({context:path.join(__dirname,'../'),manifest:require('../dllconfig/vendor.manifest.json')}));
    if(this.opt.libPath){
        this.plugins.push( new webpack.DllReferencePlugin({context:path.join(__dirname,'../'),manifest:require('../dllconfig/lib.manifest.json')}));
    }
    for(var e in this.entry){
        this.plugins.push(
            new HtmlwebpackPlugin({filename: path.dirname(e)+'/index.html',chunks: [e],template: this.opt.sourcePath + '/'+ e+'.html'})
        );
    }
    this.plugins.push(new PreHtmlPlugin(this.opt));
    if(!__DEV__){
        this.plugins.push(new webpack.optimize.UglifyJsPlugin({
            compress:{

            },
            output:{
                comments:false
            }
        })
        );
    }
    return this;
};
Config.prototype.__getPreloader = function (){
    this.module.preLoaders.push({
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        loader: 'eslint-loader'
    });
    return this;

};
Config.prototype.__getLoader = function (){
    this.module.loaders.push({
        test:/\.(js|jsx)$/,
        exclude:/node_modules/,
        include:this.opt.sourcePath,
        loader:'babel?babelrc=false&extends='+this.opt.babelrc,
    });
    this.module.loaders.push({
        test:/\.(css|scss)$/,
        loaders:['style','css','postcss'],
        exclude:/node_modules/
    });
    this.module.loaders.push({
        test:/\.(?:jpg|gif|png|svg)$/,
        loaders:[
            'url-loader?limit=8000&name=img/[hash].[ext]',
            'image-webpack'
        ]
    });
    return this;
    
};
function DllConfig(entry,opt){
    this.module = {};
    this.profile = true;
    this.opt = opt;
    this.entry = entry;
    this.plugins = [];
    this.module.loaders = [];
    this.module.preLoaders = [];
    var vendors = opt.vendors;
    this.entry = {vendor:vendors};
    this.entry.lib = entry;
    this.stats = stats;
    this.context=opt.sourcePath;
    this.output={
        publicPath:opt.publicPath,
        path:opt.outputPath,
        filename:__HOT__?'[name].js':'[name].[chunkhash].js',
        chunkFilename:__HOT__?'chunk-[name].js':'chunk-[name].[chunkhash].js'
    };
    this.module={
        preLoaders:[
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'eslint-loader'
            }
        ],
        loaders:[
            {
                test:/\.(js|jsx)$/,
                exclude:/node_modules/,
                include:opt.sourcePath,
                loader:'babel?babelrc=false&extends='+this.opt.babelrc,
            }
        ]
    };
    this.eslint = {
        configFile: __dirname+'/../.eslintrc.json'
    };
    this.plugins=[
        new webpack.DllPlugin({path:opt.manifestPath+'/'+'[name].manifest.json',name:__HOT__?'[name]':'[name]_[chunkhash]',context:path.join(__dirname,'../')}),
        new HashedModuleIdsPlugin(),
    ];

    if(!__DEV__){
        this.plugins.push(
            new webpack.optimize.UglifyJsPlugin({
                compress:{
                },
                output:{
                    comments:false
                }
            })
        );
    }
}
module.exports = Helper;














