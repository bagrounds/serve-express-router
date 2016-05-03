# serve-function

Serve a function as a REST API.

## Installation

``` bash
  $ npm install 'github:bagrounds/serve-function'
```

## Usage
The `serve-function` module has a simple interface:

``` js
  var serve = require('serve-function');
  var express = require('express');
  var router = express.Router();

  function functionToServe(options,callback){
    var result = options.a + options.b + options.c;
      callback(null,result);
  };

  var PORT = 9876;

  serve({
    port: PORT,
    endpoint: '/hello/world',
    function: functionToServe,
    parameters: ['a','b','c']
  });

  // now use the function with:
  // http://<host>:9876/hello/world?a='a'&b='b'&c='c'

```

## Run Tests
``` bash
  $ npm test
```
