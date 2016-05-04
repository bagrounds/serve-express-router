
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
                    console.log('data: ' + JSON.stringify(data));

                    var url = 'http://localhost:' + PORT;
                    url += '?a=some&b=Thing&c=Cool';

                    console.log('url: ' + url);

                    request(url,function(error,response,body){
                        console.log('body: ' + body);
                        body = JSON.parse(body);

                        chai.expect(body).to.equal('someThingCool');
                        done();
                    });
                });
        });
    });
})();
