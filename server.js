var http = require('http');
var predictionService = require('./services/predictionService.js');

http.createServer(function (req, res) {
	console.log(req.url);
	if(req.method == 'GET') {
		switch (req.url) {
			case '/service': 
				predictionService.prediction();
			break;
		}
	}
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(8124, "127.0.0.1");
console.log('Server running at http://127.0.0.1:8124/');