;(function () {
  /* global describe, it */
  "use strict";

  var chai = require("chai");

  var serve = require('../serve-function');
  var express = require('express');
  var request = require('request');
  var path = require('path');

  var lomath = require('lomath');

  var _ = require('lodash');

  var port;

  describe('app', function () {

    this.timeout(1000 * 40);

    describe('get', function () {

      it('should serve a function as a REST API', function (done) {

        var PORT = 43210;

        var serveOptions = {
          functionRequireName: path.resolve(__dirname, 'test-function.js'),
          port: PORT
        };

        serve(serveOptions, function (error, data) {

          var url = 'http://localhost:' + PORT;
          url += '?a=some&b=Thing&c=Cool';

          request(url, function (error, response, body) {

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
          functionRequireName: path.resolve(__dirname, 'test-function.js'),
          port: PORT
        };

        serve(options, function (error, data) {

          var url = 'http://localhost:' + PORT;
          url += '?shouldFail=true';

          request(url, function (error, response, body) {

            chai.expect(response.statusCode).to.not.equal(200);
            done();
          });
        });
      });
    });

    describe('post', function () {

      it('should handle post data', function (done) {

        var postData = {
          anObject: {
            a: 'aa',
            b: 1,
            c: [],
            d: {}
          },
          aString: 'string!',
          aNumber: 5,
          anArray: [
            {a:1,b:2},
            {a:3,b:4}
          ]
        };



        var PORT = 9999;

        var serveOptions = {
          functionRequireName: path.resolve(__dirname, 'test-function.js'),
          port: PORT
        };

        console.log('about to serve');
        serve(serveOptions, function (error, data) {

          error && console.error(error);
          data && console.log('data: ' + JSON.stringify(data));

          var postDataLabel = data.postDataLabel;

          var url = 'http://localhost:' + PORT;
          url += '?a=some&b=Thing&c=Cool';

          var formData = lomath.flattenJSON(postData);

          console.log('formData: ' + JSON.stringify(formData));

          var requestOptions = {
            url: url,
            json: formData
          };

          request.post(requestOptions, function (error, response, body) {

            body = lomath.unflattenJSON(body);

            error && console.error(error);
            console.log('response: ' + JSON.stringify(response));

            chai.expect(response.statusCode).to.equal(200);

            var expectedResult = {
              query: 'someThingCool',
              data: postData
            };

            var actualResult = body;

            console.log('actual  : ' + JSON.stringify(actualResult));
            console.log('expected: ' + JSON.stringify(expectedResult));

            var match = _.isEqual(expectedResult,actualResult);

            chai.expect(match).to.be.true;

            done();
          });
        });
      });
    });
  });
})();
