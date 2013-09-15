
var fs = require('fs')
var http = require('http')

http.createServer(function(req,res){
   fs.readFile('hello.json', function(err, data){

        if(err){
              res.writeHead(500, err.message)
	      res.end()
	} else {
	      res.writeHead(200, {'Content-Type':'text/plain'});
	      res.end(data)
        }
    })
}).listen(process.env.PORT || 8088)

 
