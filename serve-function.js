/**
 * Initializes an Express app and an HTTP server.
 *
 * Accepts a port number to serve on and an Express router object to serve.
 *
 * @module app
 */
;(function(){
  "use strict";
  /*****************************************************************************
   * imports
   */
  var http = require('http');
  var path = require('path');
  var express = require('express');
  var portFinder = require('portfinder');
  var errorHandler = require('errorhandler');
  var cors = require('cors');

  var exec = require('child_process').exec;

  /*****************************************************************************
   * public API
   */
  module.exports = serve;

  /*****************************************************************************
   * configure Express app
   */
  var app = express();
  app.use(errorHandler());
  app.use(cors());

  /*****************************************************************************
   * configure http server
   */
  var server = http.createServer(app);

  server.on('listening', function onListening(){
    console.log(server.address());
  });

  server.on('request', function onRequest(request){
    var message = '[' + request.ips + '] -> ';
    message += request.method + ' ';
    message += request.url;

    console.log(message);
  });

  /**
   * Given a function, a list of parameters, a port number, and an endpoint,
   * serve the function as a REST API on the given port.
   *
   * @param {Object} options - {
   *  functionInstallName:{String},
   *  functionRequireName:{String},
   *  port:{Number|undefined},
   *  endpoint{String|undefined}
   * }
   * @param {Function} callback callback(error,{app:{Object},options:{Object})
   * @returns {Object} the Express app serving the function
   */
  function serve(options, callback){

    handleOptions(options, function setup(error,options){

      var router = express.Router();

      router.get(options.endpoint,function(request,response){

        options.function(request.query,function(error,data){
          if( error ){
            response.json(error);
          } else{
            response.json(data);
          }
        });
      });

      app.set('port', options.port);

      app.use(router);

      server.listen(options.port);

      callback(error,{app:app,options:options});
    });

    return app;
  }

  /*****************************************************************************
   * Define helper functions
   */

  function handleOptions(options,callback){

    if( ! options.endpoint ){
      options.endpoint = '/';
    }

    if( ! options.port ){
      portFinder.getPort(function(error,port){
        options.port = port;

        console.log('setting port: ' + JSON.stringify(options));

        getFunction(options,function(error,result){

          options.function = result;

          callback(error,options);
        });
      });
    }
  }

  function getFunction(options, callback){

    var command = 'npm install --save ' + options.functionInstallName;

    // if an install name was supplied, install module now
    if(options.functionInstallName){
      exec(command, function(error,stdout,stderr) {

        stderr && console.error(stderr);

        callback(error,require(options.functionRequireName));
      });

      // if no install name was supplied, assume require will work
    } else{
      callback(null,require(options.functionRequireName));
    }

  }

})();