var path = require('path');
var express = require('express');
var webpack = require('webpack');
var options = require('./build/config.js');
var config = require('./build/webpack.config')(options);
var fs = require('fs');

var app = express();
var compiler = webpack(config);
app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: true,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.get('*', function(req, res) {
	console.log(req.path);
	console.log(/.js|.css|.html|.ico/.test(req.path));
	if(!/.js|.css|.html|.ico/.test(req.path)){
		var urls = req.path.split('/');
		var url = urls[1];
		if(url) {
			url = 'dist/'+url;
		}
		console.log(path.join(__dirname, url, 'index.html'));
		res.sendFile(path.join(__dirname, url, 'index.html'));
	} else {
		res.sendFile(path.join(__dirname, req.path));
	}
});

	
app.listen(9000, 'localhost', function(err) {
  if (err) {
    console.log(err);
    return;
  }

  console.log('Listening at http://localhost:9000');
});