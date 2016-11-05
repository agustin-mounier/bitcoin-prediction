var insightService = require('./insightService.js');

var prediction = function(){
	insightService.getBlockHash(12354321);
	//insightService.getBlockByIndex(0);
	insightService.getTransactionByBlock('000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f');
	//console.log(insightService.getBlock(blockHash));
}

module.exports.prediction = prediction;

