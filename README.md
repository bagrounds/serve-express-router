# serve-express-router

## Installation

``` bash
  $ npm 'https://github.com/bagrounds/serve-express-router'
```

## Usage
The `serve-express-router` module has a simple interface:

``` js
  var serve = require('serve-express-router');
  var express = require('express');
  var router = express.Router();

  // ...
  // configure router
  // ...

  var PORT = 9876;

  serve(PORT, router);

```

## Run Tests
``` bash
  $ npm test
```
