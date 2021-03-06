
// Before you start talk about CommonJS and NPM

/* Express Web Framework  */
var express = require('express')

/* LESS CSS middle ware (no need to pre-complie) */
var lessMiddleware = require('less-middleware')

// Apigee App Services API
var usergrid = require('usergrid');

/* HTTP, URL and FileSystem from Node Core */
var fs = require('fs')
var http = require('http')
var url = require('url')

/* here is our own config module, it doesn't do much really. */
var config = require('./config')

/* Our API Doc model.  We are going to read from the filesystem */
var api_model = __dirname + '/views/api_model.json';

/* express uberapp  */
var uberapp = express();

var apipage = {};

/* Our collection of apps only one now... more later ;0)  */
var APICraft = {
	"newengland": createApp({name:'newengland',type:'meetup'})
}

/* This function creates our express app  */
function createApp(obj){
	var name = obj.name;

	console.log("Creating App: " + obj.name);
	console.log("Creating App Type: " + obj.type);
	
	// Create an express application.
	var app = express();
	app.engine('.html', require('ejs').__express);
	app.set('views', __dirname + '/'+ obj.type +'/'+ obj.name +'/views');
	app.set('view engine', 'html');


	// LESS extends CSS with dynamic behavior such as variables, mixins, operations and functions.
	var lessConfig = {src: __dirname + '/' + obj.type +'/'+ obj.name +'/public',compress : true};

	app.use(lessMiddleware(lessConfig));
	app.use(function(req, res, next) {
	   if(req.url.substr(-1) == '/' && req.url.length > 1)
	       res.redirect(301, req.url.slice(0, -1));
	   else
	       next();
	});
	
	// Static stuff goes here.
	app.use(express.static(__dirname + '/'+ obj.type +'/'+ obj.name +'/public'));
	
	// Finish up our App
	console.log("Done creating App " + obj.name);
	return app;
}


// Create our API proxy
function createProxy(obj){


}


// Time to read our api model from the file system and 
// render the template.
// This happens when the server is started

fs.readFile(api_model, 'utf8', function (err, data) {
    if (err) { console.log('Error: ' + err); return; }
    console.log('No errors reading files? Phew.  Ready for I/O.');
    
    console.log(data)
    apipage = JSON.parse(data);
	apipage.name = "API Craft New England Meetups";

	APICraft.newengland.get('/', function(req, res) {
	  res.render('index', { proxyUrl: config.proxyUrl, page: apipage });
	});

	APICraft.newengland.get('/meetup/newengland', function(req, res) {
	  res.render('index', { proxyUrl: config.proxyUrl, page: apipage });
	});
	
	
	uberapp.enable('strict routing');
	uberapp.all('/meetup/newengland', function(req, res) { res.redirect('/meetup/newengland/'); });
	uberapp.use('/meetup/newengland/',express.static(__dirname+'/public'));
	uberapp.use('/meetup/newengland/', APICraft.newengland).use('/', APICraft.newengland);

	var port = process.env.PORT || 3000;
	uberapp.listen(port);

});


