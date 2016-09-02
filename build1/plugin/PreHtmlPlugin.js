var glob = require('glob');
function PreHtmlPlugin(opt){
    this.opt = opt;
}
PreHtmlPlugin.prototype.apply = function(compiler){
    var ctx = this;
    compiler.plugin('compilation',function(compilation){
        compilation.plugin('html-webpack-plugin-after-emit', function(file, callback) {
            var manifest = glob.sync(ctx.opt.manifestPath+'/*.manifest.json');
            var other = '';
            manifest.map(function(j){
                other+='<script src="'+ctx.opt.publicPath+(require(j).name.replace('_','.')+'.js')+'"></script>';
            });
            var htmlSource = file.html.source();
            htmlSource = htmlSource.replace(/(<\/head>)/, other + '$1');
            file.html.source = function() {
                return htmlSource;
            };
            callback(null,file);
        });
    });
};
module.exports = PreHtmlPlugin;