/**
 *
 */
;(function(){
    'use strict';

    module.exports = testFunction;

    /**
     *
     * @returns {*}
     * @param options
     * @param callback
     */
    function testFunction(options,callback){

        if( options.shouldFail ){
            callback("failing, per request");
            return;
        }

        callback(null, options.a + options.b + options.c);
    }
})();