/**
 *
 */
;(function(){
    'use strict';

    module.exports = testFunction;

    /**
     *
     * @returns {*}
     * @param {Object} options
     * @param {String|Number} options.a
     * @param {String|Number} options.b
     * @param {String|Number} options.c
     * @param {Object} [options.data]
     * @param {Boolean} [options.shouldFail]
     * @param {Function} callback
     */
    function testFunction(options,callback){

        console.log('inside test function');

        if( options.shouldFail ){
            callback("failing, per request");
            return;
        }

        var result = options.a + options.b + options.c;

        console.log('pre result: ' + result);

        if( options.data ){

            console.log('inbound data: ' + JSON.stringify(options.data));
            result = {
                query: result,
                data: options.data
            }
        }

        console.log('test function result: ' + JSON.stringify(result));
        callback(null,result);
    }
})();