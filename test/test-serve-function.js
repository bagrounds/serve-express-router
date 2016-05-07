
;(function(){
    "use strict";

    var chai = require("chai");

    describe('app', function() {

        var serve = require('../serve-function');
        var express = require('express');
        var request = require('request');
        var path = require('path');

        var port;

        this.timeout(1000 * 40);

        it('should serve a function as a REST API', function (done) {

            var PORT = 43210;

            var options = {
                functionRequireName: path.resolve(__dirname,'test-function.js'),
                port: PORT
            };

            serve(options,function(error,data){

                var url = 'http://localhost:' + PORT;
                url += '?a=some&b=Thing&c=Cool';

                request(url,function(error,response,body){
                    body = JSON.parse(body);

                    chai.expect(response.statusCode).to.equal(200);

                    chai.expect(body).to.equal('someThingCool');
                    done();
                });
            });
        });

        it('should return an error for bad inputs', function (done) {

            var PORT = 12345;

            var options = {
                functionRequireName: path.resolve(__dirname,'test-function.js'),
                port: PORT
            };

            serve(options,function(error,data){

                var url = 'http://localhost:' + PORT;
                url += '?shouldFail=true';

                request(url,function(error,response,body){

                    chai.expect(response.statusCode).to.not.equal(200);
                    done();
                });
            });
        });
    });
})();
