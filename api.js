var express = require('express');
var expressWs = require('express-ws');
var net = require('net');
var crypto = require('crypto');

function generateToken() {
	return crypto.randomBytes(32).toString('hex');
}

module.exports = function (server) {
	var app = express();

	var sockets = {};

	app.post('/api/vm/net/connect', function (req, res) {
		var socket = net.connect({
			host: req.body.host,
			port: req.body.port
		}, function (err) {
			if (err) {
				res.status(500).send({
					code: 500,
					error: err
				});
				return;
			}

			// Generate a token for this connection
			var token = generateToken();
			sockets[token] = socket;

			// Remove the socket from the list when closed
			socket.on('end', function () {
				if (sockets[token]) {
					delete sockets[token];
				}
			});

			console.log('Connected to '+req.body.host+':'+req.body.port+' ('+token+')');

			var remote = socket.address();
			res.send({
				token: token,
				remote: remote
			});
		});
	});

	var wss = expressWs(app, server);

	app.ws('/api/vm/net/socket', function (ws, req) {
		var token = req.query.token;

		if (!sockets[token]) {
			console.warn('Unknown TCP connection with token "'+token+'"');
			ws.close();
			return;
		}

		var socket = sockets[token];
		//delete sockets[token];

		console.log('Forwarding socket with token '+token);

		ws.on('message', function (chunk, flags) {
			socket.write(flags.buffer || chunk, 'binary', function () {
				//console.log('Sent: ', (flags.buffer || chunk).toString());
			});
		});
		socket.on('data', function (chunk) {
			//console.log('Received: ', chunk.toString());
			// Providing a callback is important, otherwise errors can be thrown
			ws.send(chunk, { binary: true }, function (err) {});
		});
		socket.on('end', function () {
			console.log('TCP connection closed by remote ('+token+')');
			ws.close();
		});
		ws.on('close', function () {
			socket.end();
			console.log('Websocket connection closed ('+token+')');
		});
	});

	return app;
};