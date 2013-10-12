
## Express 3.0.0 Web Application Framework for Node.js


## Web Applications
Express is a minimal and flexible node.js web application framework, providing a robust set of features for building single and multi-page, and hybrid web applications.

## APIs
With a myriad of HTTP utility methods and Connect middleware at your disposal, creating a robust user-friendly API is quick and easy.

## Performance
Express provides a thin layer of features fundamental to any web application, without obscuring features that you know and love in node.js

## Getting started with Express
With node installed (download), get your first application started by creating a directory somewhere on your machine:

    $ mkdir hello-world


In this same directory you'll be defining the application "package", which are no different than any other node package. You'll need a package.json file in the directory, with express defined as a dependency. You may use npm info express version to fetch the latest version, it's preferred that you do this instead of "3.x" below to prevent any future surprises.
    
    {
      "name": "hello-world",
      "description": "hello world test app",
      "version": "0.0.1",
      "private": true,
      "dependencies": {
        "express": "3.x"
      }
    }
    
Now that you have a package.json file in this directory you can use npm(1) to install the dependencies, in this case just Express:

    $ npm install

Once npm finishes you'll have a localized Express 3.x dependency in the ./node_modules directory. You may verify this with npm ls as shown in the following snippet displaying a tree of Express and its own dependencies.

    $ npm ls
    hello-world@0.0.1 /private/tmp
    └─┬ express@3.0.0beta7
      ├── commander@0.6.1
      ├─┬ connect@2.3.9
      │ ├── bytes@0.1.0
      │ ├── cookie@0.0.4
      │ ├── crc@0.2.0
      │ ├── formidable@1.0.11
      │ └── qs@0.4.2
      ├── cookie@0.0.3
      ├── debug@0.7.0
      ├── fresh@0.1.0
      ├── methods@0.0.1
      ├── mkdirp@0.3.3
      ├── range-parser@0.0.4
      ├─┬ response-send@0.0.1
      │ └── crc@0.2.0
      └─┬ send@0.0.3
        └── mime@1.2.6
    
Now to create the application itself! Create a file named app.js or server.js, whichever you prefer, require express and then create a new application with express():

    var express = require('express');
    var app = express();
    With the new application instance you can start defining routes via app.VERB(), in this case "GET /" responding with the "Hello World" string. The req and res are the exact same objects that node provides to you, thus you may invoke res.pipe(), req.on('data', callback) and anything else you would do without Express involved.
    
    app.get('/hello.txt', function(req, res){
      var body = 'Hello World';
      res.setHeader('Content-Type', 'text/plain');
      res.setHeader('Content-Length', body.length);
      res.end(body);
    });

Express augments these objects providing you with higher level methods such as res.send(), which among other things adds the Content-Length for you:

    app.get('/hello.txt', function(req, res){
      res.send('Hello World');
    });

Now to bind and listen for connections invoke the app.listen() method, accepting the same arguments as node's net.Server#listen():

    app.listen(3000);
    console.log('Listening on port 3000');


## Using Express to generate an app

Express is bundled with an executable, aptly named express(1). If you install express globally with npm you'll have it available from anywhere on your machine:

    $ npm install -g express

This tool provides a simple way to get an application skeleton going, but has limited scope, for example it supports only a few template engines, whereas Express itself supports virtually any template engine built for node. Be sure to check out the --help:

    Usage: express [options]
    
    Options:
    
      -h, --help          output usage information
      -V, --version       output the version number
      -s, --sessions      add session support
      -e, --ejs           add ejs engine support (defaults to jade)
      -J, --jshtml        add jshtml engine support (defaults to jade)
      -H, --hogan         add hogan.js engine support
      -c, --css   add stylesheet  support (less|stylus) (defaults to plain css)
      -f, --force         force on non-empty directory
    If you want to generate an application with EJS, Stylus, and session support you would simply execute:
    
    $ express --sessions --css stylus --ejs myapp
    
    create : myapp
    create : myapp/package.json
    create : myapp/app.js
    create : myapp/public
    create : myapp/public/javascripts
    create : myapp/public/images
    create : myapp/public/stylesheets
    create : myapp/public/stylesheets/style.styl
    create : myapp/routes
    create : myapp/routes/index.js
    create : myapp/views
    create : myapp/views/index.ejs
    
    install dependencies:
      $ cd myapp && npm install
      
    run the app:
      $ node app  
  

Like any other node application, you must then install the dependencies:

    $ cd myapp
    $ npm install

Then fire it up!

    $ node app

That's all you need to get a simple application up and running. Keep in mind that Express is not bound to any specific directory structure, these are simply a baseline for you to work from. For application structure alternatives be sure to view the examples found in the github repo.

##Error handling
Error-handling middleware are defined just like regular middleware, however must be defined with an arity of 4, that is the signature (err, req, res, next):

    app.use(function(err, req, res, next){
      console.error(err.stack);
      res.send(500, 'Something broke!');
    });
    
    
Though not mandatory error-handling middleware are typically defined very last, below any other app.use() calls as shown here:


    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(function(err, req, res, next){
      // logic
    });

Responses from within these middleware are completely arbitrary. You may wish to respond with an HTML error page, a simple message, a JSON string, or anything else you prefer.

For organizational, and higher-level framework purposes you may define several of these error-handling middleware, much like you would with regular middleware. For example suppose you wanted to define an error-handler for requests made via XHR, and those without, you might do:

    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(logErrors);
    app.use(clientErrorHandler);
    app.use(errorHandler);

Where the more generic logErrors may write request and error information to stderr, loggly, or similar services:


    function logErrors(err, req, res, next) {
      console.error(err.stack);
      next(err);
    }


Where clientErrorHandler is defined as the following, note that the error is explicitly passed along to the next.

    function clientErrorHandler(err, req, res, next) {
      if (req.xhr) {
        res.send(500, { error: 'Something blew up!' });
      } else {
        next(err);
      }
    }

The following errorHandler "catch-all" implementation may be defined as:

    function errorHandler(err, req, res, next) {
      res.status(500);
      res.render('error', { error: err });
    }

## Users online count
This section details a full (small) application that tracks a users online count using Redis. First up you'll need to create a package.json file containing two dependencies, one for the redis client, another for Express itself. Also make sure you have redis installed and running via $ redis-server.

    {
      "name": "app",
      "version": "0.0.1",
      "dependencies": {
        "express": "3.x",
        "redis": "*"
      }
    }
    
Next you'll need to create an app, and a connection to redis:

    var express = require('express');
    var redis = require('redis');
    var db = redis.createClient();
    var app = express();

Next up is the middleware for tracking online users. Here we'll use sorted sets so that we can query redis for the users online within the last N milliseconds. We do this by passing a timestamp as the member's "score". Note that here we're using the User-Agent string in place of what would normally be a user id.

    app.use(function(req, res, next){
      var ua = req.headers['user-agent'];
      db.zadd('online', Date.now(), ua, next);
    });


This next middleware is for fetching the users online in the last minute using zrevrangebyscore to fetch with a positive infinite max value so that we're always getting the most recent users, capped with a minimum score of the current timestamp minus 60,000 milliseconds.

    app.use(function(req, res, next){
      var min = 60 * 1000;
      var ago = Date.now() - min;
      db.zrevrangebyscore('online', '+inf', ago, function(err, users){
        if (err) return next(err);
        req.online = users;
        next();
      });
    });

Then finally we use it, and bind to a port! That's all there is to it, visit the app in a few browsers and you'll see the count increase.

    app.get('/', function(req, res){
      res.send(req.online.length + ' users online');
    });

    app.listen(3000);

## Express behind proxies
Using Express behind a reverse proxy such as Varnish or Nginx is trivial, however it does require configuration. By enabling the "trust proxy" setting via app.enable('trust proxy'), Express will have knowledge that it's sitting behind a proxy and that the X-Forwarded-* header fields may be trusted, which otherwise may be easily spoofed.

Enabling this setting has several subtle effects. The first of which is that X-Forwarded-Proto may be set by the reverse proxy to tell the app that it is https or simply http. This value is reflected by req.protocol.

The second change this makes is the req.ip and req.ips values will be populated with X-Forwarded-For's list of addresses.
