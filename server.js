var http = require('http');
var https = require('https');
var urlParser = require('url-parse');
var predictionService = require('./services/predictionService.js');
var io = require('socket.io-client');

http.createServer(function (req, res) {
	if(req.method == 'GET') {
		var url = urlParser(req.url, true);
		if(url.pathname == '/estimateFee'){
			var queryString = url.query;
			var nBlocks = queryString.nBlocks;
			var txSize = queryString.txSize;
			var fee = predictionService.estimateFee(nBlocks, txSize);
			res.writeHead(200, {'Content-Type': 'text/plain'});
			res.end(JSON.stringify(fee));
		}
		else {
			res.writeHead(400, {'Content-Type': 'text/plain'});
			res.end('Bad Request');
		}
	}
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
	predictionService.txHandler(data.txid);
});

socket.on(blockEventToListenTo, function(blockHash) {
	console.log("Found BLOCK");
	predictionService.blockHandler(blockHash);
});

predictionService.initialize();
