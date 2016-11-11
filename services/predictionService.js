var insightService = require('./insightService.js');
var HashMap = require('hashmap');
var sleep = require('sleep')


var prediction = function(){
	//insightService.getBlockHash(12354);
	//insightService.getBlockByIndex(0);
	//insightService.getTransactionByBlock('00000000c78cd1009c04e276688e7766a68a111b20a8f850475e3ce53d93cd0e');
	insightService.getLastBlock();
}

var estimateFeesByHeight = function() {
	var blocks = [];
	var feesByBlock = new HashMap();
	var procesed = new HashMap();

	var blocksToAnalize = 20;
	var analizedBlocks = 0;

	var storeResult = function(tx) {
		var key = Math.ceil((tx.blocktime - tx.time) / 10*60*1000); // cantidad de bloques q tardo en procesarse la tx
		var value = tx.fees / tx.size;

		if(isNaN(value)) {
			console.log("NaN detected -----");
			console.log(tx.blocktime);
			console.log(tx.time);
			console.log(tx.fees);
			console.log(tx.size);
			return;
		}

		if(feesByBlock.has(key)){
			var currValue = feesByBlock.get(key);
			var newValue = (value + currValue) / (procesed.get(key) + 1); // nuevo promedio.
			feesByBlock.set(key, newValue);
			procesed.set(key, procesed.get(key) + 1);
		} else {
			feesByBlock.set(key, value);
			procesed.set(key, 1);
		}
		console.log("fees para 0 bloques");
		console.log(feesByBlock.get(0));
		console.log("cantidad de 0 bloques");
		console.log(procesed.get(0));
		console.log(procesed.get(1));
	}


	var getTxInBlock = function(block){
		var txs = block.tx.length > 15 ? 15 : block.tx.length;
		for(var i = 0; i < txs; i++){
			insightService.getTransaction(block.tx[i], storeResult);
		}
	}

	var getNBlocks = function(lastBlock){
		for(var i = lastBlock.height; i > lastBlock.height - 2; i--){
			insightService.getBlockByIndex(i, getTxInBlock);
		}
	};

	insightService.getLastBlock(getNBlocks);
}

function sleep(time, callback) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
    callback();
}

module.exports.prediction = prediction;
module.exports.estimateFeesByHeight = estimateFeesByHeight;

