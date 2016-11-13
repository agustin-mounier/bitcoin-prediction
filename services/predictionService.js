var insightService = require('./insightService.js');
var HashMap = require('hashmap');
var sleep = require('sleep')
fs = require('fs')

var prediction = function(){
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
		var toPrint = key.toString() + ' ' + tx.fees.toString() + ' ' + tx.size.toString();
		console.log(toPrint);
		fs.appendFile('data.txt', toPrint + '\n', function (err) {});

		if(feesByBlock.has(key)){
			var currValue = feesByBlock.get(key);
			var newValue = (value + currValue) / (procesed.get(key) + 1); // nuevo promedio.
			feesByBlock.set(key, newValue);
			procesed.set(key, procesed.get(key) + 1);
		} else {
			feesByBlock.set(key, value);
			procesed.set(key, 1);
		}
	}


	var getTxInBlock = function(block){
		//var txs = block.tx.length > 15 ? 15 : block.tx.length;
		var i = 1;

		var refreshIntervalId = setInterval( function() { 
												iterateTxs(i, block.tx, refreshIntervalId);
												i++; 
												if(i === block.tx.length){
       												clearInterval(refreshIntervalId);
   												} }, 5000 );

		var iterateTxs = function(currTx, tx){
			console.log("currTx " + currTx);
			insightService.getTransaction(tx[currTx], storeResult);
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

var txMap = new HashMap();
var currentBlock = 0;

var txHandler = function (txid) {
	txMap.set(txid, currentBlock);
}

var checkTransaction = function (block) {
	txMap.forEach(function(txid, blockNumber) {
    	console.log(txid + " : " + blockNumber);
	});
}

var blockHandler = function (blockid) {
	currentBlock += 1;
}

module.exports.txHandler = txHandler;
module.exports.blockHandler = blockHandler;
module.exports.prediction = prediction;
module.exports.estimateFeesByHeight = estimateFeesByHeight;

