
;(function(){
    "use strict";

    var chai = require("chai");

    describe('app', function() {

        var serve = require('../serve-function');
        var express = require('express');
        var request = require('request');

        it('should serve a function as a REST API', function (done) {
            this.timeout(1000 * 20);

                var options = {
                    functionInstallName: 'git+https://bgrounds%40ea.com@stash.ea.com/scm/~bgrounds_ea.com/analytics-data.git',
                    functionRequireName: 'analytics-data'
                };

                serve(options,function(error,data){
                    console.log('serving');

                    var url = 'http://localhost:' + data.options.port;
                    url += '?source=jira&from=2016-01-01&to=2016-01-05';

                    request(url,function(error,response,body){
                        console.log('response');
                        body = JSON.parse(body);

                        chai.expect(body.issues).to.be.ok;
                        done();
                    });
                });

        });
    });
})();
