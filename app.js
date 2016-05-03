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
  var express = require('express');
  var errorHandler = require('errorhandler');
  var cors = require('cors');

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
   * @param {Object} options
   * @returns {Object} the Express app serving the function
     */
  function serve(options){

    var router = express.Router();

    var endpoint = options.endpoint;
    var f = options.function;
    var parameters = options.parameters;
    var port = options.port;

    // define router
    router.get(endpoint,function(request,response){

      // get parameters from query and put them in options object
      var options = parameters.reduce(function(options,parameterName){
        options[parameterName] = request.query[parameterName];
        return options;
      },{});

      // call function with options, return result in http response
      f(options,function(error,data){
        response.json({error:error,data:data});
      });
    });

    app.set('port', port);

    app.use(router);

    server.listen(port);

    return app;
  }

})();