
;(function(){
    "use strict";

    var chai = require("chai");

    describe('app', function() {

        var serve = require('../app');
        var express = require('express');
        var portFinder = require('portfinder');
        var request = require('request');

        it('should serve an Express router', function (done) {
            portFinder.getPort(function test(error,port){
                var randomMessage = "time:" + new Date();

                var router = express.Router();

                router.get('/', function(request,response){
                    response.send(randomMessage);
                });

                serve(port,router);

                var url = 'http://localhost:' + port;

                request(url,function(error,response,body){

                    chai.expect(body).to.equal(randomMessage);
                    done();
                });
            });
        });
    });
})();
