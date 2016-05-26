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

  var lomath = require('lomath');

  var _ = require('lodash');

  var bodyParser = require('body-parser');

  var exec = require('child_process').exec;

  portFinder.basePort = 43210;

  /*****************************************************************************
   * public API
   */
  module.exports = serve;

  /**
   * Given a function, a list of parameters, a port number, and an endpoint,
   * serve the function as a REST API on the given port.
   *
   * @param {Object} options
   * @param {String} options.functionRequireName
   * @param {String} [options.functionInstallName]
   * @param {Number} [options.port]
   * @param {String} [options.endpoint]
   *
   * @param {Function} callback handle results
   *
   * @return {Object} the Express app serving the function
   */
  function serve(options, callback){

    var verb = options.verb || 'get';


    /***************************************************************************
     * configure Express app
     */
    var app = express();
    app.use(errorHandler());
    app.use(cors());

    app.use(bodyParser.json()); // for parsing application/json
    app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded



    /***************************************************************************
     * configure http server
     */
    var server = http.createServer(app);

    handleOptions(options, function setup(error,handledOptions){

      var PORT = handledOptions.port;

      var router = express.Router();
      httpPost(router, handledOptions);
      httpGet(router, handledOptions);


      app.set('port', PORT);

      app.use(router);

      server.on('listening',function(){
        console.log(server.address());

        callback(error,{app:app,options:handledOptions});
      });

      server.on('request', function onRequest(request){
        var message = '[' + request.ips + '] -> ';
        message += request.method + ' ';
        message += request.url;

        console.log(message);
      });

      server.listen(PORT);

    });

    return app;
  }

  function httpGet(router, options){

    router.get(options.endpoint,function(request,response){

      options.function(request.query,function(error,data){

        if( error ){

          response.status(500).send(error.message);
        } else{

          response.json(data);
        }
      });
    });
  }

  function httpPost(router, options){

    console.log('define post request');

    router.post(options.endpoint ,function(request,response){

      console.log('inside post request definition');

      var functionOptions = request.query;

      functionOptions.data = request.body;

      console.log('function options ' + JSON.stringify(functionOptions));


      options.function(functionOptions, function(error, data) {

        console.log('inside httpPost function... data   = ' + JSON.stringify(data));
        var result = lomath.flattenJSON(data);

        console.log('inside httpPost function... result = ' + JSON.stringify(result));
        response.json(result);

      });
    });
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

        getFunction(options,callback);
      });
    } else {
      getFunction(options,callback);
    }
  }

  function getFunction(options, callback){

    var command = 'npm install --save ' + options.functionInstallName;

    // if an install name was supplied, install module now
    if(options.functionInstallName){
      exec(command, function(error,stdout,stderr) {

        stderr && console.error(stderr);

        options.function = require(options.functionRequireName);


        callback(error,options);
      });

      // if no install name was supplied, assume require will work
    } else{

      options.function = require(options.functionRequireName);
      callback(null,options);
    }

  }

})();