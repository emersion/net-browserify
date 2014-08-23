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
```
$ npm install git+https://github.com/emersion/net-browserify.git
```

> This module is not available as an NPM package yet, but will be soon! ;)

You can set a custom proxy address if you want to:
```js
var net = require('net');

// Optionaly, set a custom proxy address
net.setProxy({
	hostname: 'example.org',
	port: 42
});
```

### For the server

```js
var express = require('express');
var netApi = require('net-browserify/api');

// Create a server
var server = require('http').createServer();

// Create our app
var app = express();
server.addListener('request', app);

app.use(netApi(server));

// Start the server
server.listen(app.get('port'), function() {
	console.log('Server listening on port ' + app.get('port'));
});
```

> The API takes `server` as an argument since [`ws`](https://www.npmjs.org/package/ws) requires it.

License
-------

The MIT license.