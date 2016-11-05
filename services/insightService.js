var http = require('http');

var options = {
  host: 'localhost',
  port: 3001,
  path: '',
  method: 'GET',
  headers: {
      'Content-Type': 'application/json'
  }
};


var GET = function(options, callback) {
	var req = http.get(options, function(res) {
		console.log('STATUS: ' + res.statusCode);
		res.on('data', function (data) {
			if(callback == undefined) { 
				console.log(JSON.parse(data));
			} else {
				callback(JSON.parse(data));
			}
		});
	});
}

var getBlockByIndex = function(index) {
	getBlockHash(index, getBlock);
}

var getBlockHash = function(index, callback){
	options.path = '/insight-api/block-index/' + index;
	GET(options, callback);
	
}

var getBlock = function(resp, callback){
	options.path = '/insight-api/block/' + resp.blockHash;
	GET(options, callback);
}

var getTransactionByBlock = function(blockHash, callback){
	options.path = '/insight-api/txs/?block=' + blockHash;
	GET(options, callback);
}

module.exports.getBlockHash = getBlockHash;
module.exports.getBlock = getBlock;
module.exports.getBlockByIndex = getBlockByIndex;
module.exports.getTransactionByBlock = getTransactionByBlock;




