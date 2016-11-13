var http = require('http');
var https = require('https');
var predictionService = require('./services/predictionService.js');
var io = require('socket.io-client');

http.createServer(function (req, res) {
	console.log(req.url);
	if(req.method == 'GET') {
		switch (req.url) {
			case '/service': 
				predictionService.estimateFeesByHeight();
			break;
		}
	}
	res.writeHead(200, {'Content-Type': 'text/plain'});
	res.end('Hello World\n');
	
}).listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124/');

txEventToListenTo = 'tx';
blockEventToListenTo = 'block';
room = 'inv';

var socket = io("https://blockexplorer.com/");
socket.on('connect', function() {
// Join the room.
socket.emit('subscribe', room);
})
var txs = 0;
socket.on(txEventToListenTo, function(data) {
	if(txs % 10 == 0)
		console.log("Found 10 transactions");
	txs++;
	predictionService.txHandler(data.txid);
});

socket.on(blockEventToListenTo, function(blockHash) {
	console.log("Found BLOCK");
	predictionService.blockHandler(blockHash);
});

predictionService.initialize();
