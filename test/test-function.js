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

        callback(null, options.a + options.b + options.c);
    }
})();