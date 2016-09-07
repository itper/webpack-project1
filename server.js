// Dependencies
import express from 'express';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { match, RouterContext, browserHistory } from 'react-router';
import fs from 'fs';

// Routes
import routes from './src/router';

// consts
const app = express();

// Setup App
app.use(express.static(__dirname + '/public'));

// Start App
app.use((req, res, next) => {
	let urls = req.url.split('/');
	let url = urls[1];
	console.log(req.url);
	// Create Router
	match({ routes, location: req.url, history: browserHistory }, (error, redirect, renderProps) => {
      if (error)
        res.status(500).send(error.message);
      else {
        let html = ReactDOMServer.renderToString(<RouterContext {...renderProps} />);
        fs.readFile('./dist/'+url+'/index.html', 'utf-8', function(err, data){
        	if(err) {
       			res.end('<!DOCTYPE html>' + html);
       			return;
        	}
			var tempHtml = data.replace(/(<div id=\"app\">)/, '$1'+html);
			res.end(tempHtml);
        });
      }
  });
});

// Start server
app.listen(3001, () => {
  console.log('React ES6 Server Side Render app listening at http://localhost:3001');
});
