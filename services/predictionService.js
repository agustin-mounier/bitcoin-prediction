var insightService = require('./insightService.js');
var HashMap = require('hashmap');
var sleep = require('sleep')
fs = require('fs')

var feesByBlock = new HashMap();
var procesed = new HashMap();

var txMap = new HashMap();
var currentBlock = 0;

var prediction = function(){

}

var estimateFeesByHeight = function() {
	
}


var storeResult = function(tx) {
	var key = currentBlock - txMap.get(tx.txid);// cantidad de bloques q tardo en procesarse la tx
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

	txMap.remove(tx.txid);
}


var getTxInBlock = function(block){
	var i = 0;

	var refreshIntervalId = setInterval( function() { 
											iterateTxs(i, block.tx);
											i++; 
											if(i === block.tx.length){
   												clearInterval(refreshIntervalId);
												} }, 1000 );

	var iterateTxs = function(currTx, tx){
		if(txMap.has(tx[currTx])) {
			console.log("currTx " + currTx);
			insightService.getTransaction(tx[currTx], storeResult);
		}
	}
}

var txHandler = function (txid) {
	txMap.set(txid, currentBlock);
}

var checkTransaction = function (block) {
	txMap.forEach(function(txid, blockNumber) {
    	console.log(txid + " : " + blockNumber);
	});
}

var blockHandler = function (blockHash) {
	console.log(blockHash);
	currentBlock += 1;
	insightService.getBlock(blockHash, getTxInBlock)
}

module.exports.txHandler = txHandler;
module.exports.blockHandler = blockHandler;
module.exports.prediction = prediction;
module.exports.estimateFeesByHeight = estimateFeesByHeight;

