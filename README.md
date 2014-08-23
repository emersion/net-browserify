net-browserify
==============

`net` module for browserify, with a websocket server proxy.

Supported methods:
* `net.connect(options, cb)`
* `net.isIP(input)`, `net.isIPv4(input)`, `net.isIPv6(input)`

How to use
----------

### For the client

Just require this module or map this module to the `net` module with [Browserify](https://github.com/substack/node-browserify).

### For the server

```js
var express = require('express');
var netApi = require('net-browserify/api');

var app = express();

app.use(netApi);
```

License
-------

The MIT license.