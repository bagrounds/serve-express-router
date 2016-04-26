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
  var typeCheck = require('type-check').typeCheck;

  /*****************************************************************************
   * public API
   */
  module.exports = serve;

  /*****************************************************************************
   * configure Express app
   */
  var app = express();
  app.use(errorHandler());

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
   * Given a port number and a router, serve the router on port.
   *
   * @param {Number} port to serve on
   * @param {Object|Array<Object>} routers as defined by Express
   * @returns {Object} The Express app
   */
  function serve(port,routers){

    app.set('port', port);

    // if routers is an array, serve each router
    if( typeCheck('Array',routers) ){
      routers.forEach(function(router){
        app.use(router);
      });
    } else {
      app.use(routers);
    }

    server.listen(port);

    return app;
  }

})();