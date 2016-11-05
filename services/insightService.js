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
	var blockHash

	if (resp.blockHash == undefined)
		blockHash = resp.lastblockhash;
	else
		blockHash = resp.blockHash

	options.path = '/insight-api/block/' + blockHash;
	GET(options, callback);
}

var getTransactionByBlock = function(blockHash, callback){
	options.path = '/insight-api/txs/?block=' + blockHash;
	GET(options, callback);
}

var getLastBlock = function() {
	options.path = '/insight-api/status?q=getLastBlockHash'
	GET(options, getBlock)
}

module.exports.getBlockHash = getBlockHash;
module.exports.getBlock = getBlock;
module.exports.getBlockByIndex = getBlockByIndex;
module.exports.getTransactionByBlock = getTransactionByBlock;
module.exports.getLastBlock = getLastBlock;



