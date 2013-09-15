

/* Express Web Framework  */
var express = require('express')

/* LESS CSS middle ware (no need to pre-complie) */
var lessMiddleware = require('less-middleware')

// Apigee App Services API
var usergrid = require('usergrid')

/* HTTP, URL and FileSystem from Node Core */
var fs = require('fs')
var http = require('http')
var url = require('url')


http.createServer(function(req, res) {
   res.writeHead(200, {'Content-Type':'text/plain'})
   res.end('Hello World')
}).listen(process.env.PORT || 3000)

console.log('Web Server is runnin...')
