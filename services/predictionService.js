var insightService = require('./insightService.js');

var prediction = function(){
	//insightService.getBlockHash(12354);
	//insightService.getBlockByIndex(0);
	//insightService.getTransactionByBlock('00000000c78cd1009c04e276688e7766a68a111b20a8f850475e3ce53d93cd0e');
	insightService.getLastBlock();
}

var estimateFeesByHeight = function() {

}

module.exports.prediction = prediction;

