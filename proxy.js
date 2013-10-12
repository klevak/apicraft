
var fs = require('fs');


var config = require('./config')


// Apigee App Services API
var usergrid = require('usergrid');


argo()
  .get('/goals', function(handle) {
    handle('request', function(env, next) {
        
        // argo proxy options
        var options = {
            method:'GET',
            endpoint:'goals'
        };

        var object = {
            error:'no goals'
        };

                    
        // app services client
        var client = new usergrid.client({
            orgName:'kkleva@llbean.com',
            appName:'demo',
            authType:usergrid.AUTH_CLIENT_ID,
            clientId:'YXA6goLmkaIMEeKa9ALoGsklFQ',
            clientSecret:'YXA6JS_-82UZcMZ_kd5c_9i2GxROlYM',
            logging: true, 
            buildCurl: true
        });

        client.request(options, function (err, data) {
            if (err) {
                console.log('GET failed');
            } else {
                
                // set headers
                env.response.setHeader('Content-Type', 'application/json;charset=UTF-8');
                if(data.count > 0){
                    env.response.statusCode = 200
                    env.response.body = data

                } else {
                    env.response.statusCode = 404
                    env.response.body = object
                }
                next(env);
            }
        });
    });
  })
  .post('/goals', function(handle) {
    handle('request', function(env, next) {

    var options = {
        type:'goal',
        name:'This is my first goal'
    };
        
     client.createEntity(options, function (err, goal) {
        if (err) {
            //error - goal not created
        } else {
            //success -goal is created
    
            //once the goal is created, you can set single properties:
            goal.set('type','Personal');
    
            //or a JSON object:
            var data = {
                goal:'I want to learn all there is about Node!',
                status:'No longer completely confus'
            }
            //set is additive, so previously set properties are not overwritten
            goal.set(data);
    
            //finally, call save on the object to save it back to the database
            goal.save(function(err){
                var object = {};
                if (err){
                    //error - goal not saved
                    env.response.statusCode = 404;
                    object = {
                        error:'no goals'
                    };
                } else {
                    //success - new goal is saved
                    object = {
                        success:'goal saved'
                    };
                }

                env.response.body = object;
                next(env);
                
            });
        }
     });
   });
  })
  .listen(process.env.PORT || 3001);