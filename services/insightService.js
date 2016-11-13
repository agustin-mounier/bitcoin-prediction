var https = require('https');

var options = {
  host: 'blockexplorer.com',
  path: '',
  method: 'GET',
  headers: {
      'Content-Type': 'application/json'
  }
};

var GET = function(options, callbacks) {
	var req = https.get(options, function(res) {
			res.setEncoding('utf8');
    		var body = "";
    		res.on('data', function(resData) {
        	body += resData;
    		});
    		res.on('end', function() {
				if(callbacks === undefined) { 
					console.log(JSON.parse(body));
				} else if(typeof callbacks == 'function'){ 
					callbacks(JSON.parse(body));
				} else {
					var currCallback = callbacks.shift();
					if(currCallback == undefined)
						console.log(JSON.parse(body));
					else 
						currCallback(JSON.parse(body), callbacks);
				}
			});
	});
}

var getBlockByIndex = function(index, callback) {
	getBlockHash(index, [getBlock, callback]);
}

var getBlockHash = function(index, callback){
	options.path = '/api/block-index/' + index;
	GET(options, callback);
	
}

var getBlock = function(resp, callback){
	var blockHash

	if (resp.blockHash == undefined)
		blockHash = resp.lastblockhash;
	else
		blockHash = resp.blockHash

	options.path = '/api/block/' + blockHash;
	GET(options, callback);
}

var getTransactionByBlock = function(blockHash, callback){
	options.path = '/api/txs/?block=' + blockHash;
	GET(options, callback);
}

var getLastBlock = function(callback) {
	options.path = '/api/status?q=getLastBlockHash'
	GET(options, [getBlock, callback])
}

var getTransaction = function(txId, callback) {
	options.path = '/api/tx/' + txId;
	GET(options, callback)
}

module.exports.getBlockHash = getBlockHash;
module.exports.getBlock = getBlock;
module.exports.getBlockByIndex = getBlockByIndex;
module.exports.getTransactionByBlock = getTransactionByBlock;
module.exports.getLastBlock = getLastBlock;
module.exports.getTransaction = getTransaction;




