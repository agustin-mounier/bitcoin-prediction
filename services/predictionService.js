var insightService = require('./insightService.js');
var interpolatingPolynomial = require('interpolating-polynomial');
var HashMap = require('hashmap');
fs = require('fs')

var feesByBlock = new HashMap();
var procesed = new HashMap();

var txMap = new HashMap();
var lastBlockHeight;

var storeResult = function(tx) {

	var key = lastBlockHeight - txMap.get(tx.txid);// cantidad de bloques q tardo en procesarse la tx
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
	
	lastBlockHeight = block.height;
	var i = 0;

	var refreshIntervalId = setInterval( function() { 
											iterateTxs(i, block.tx);
											i++;
											if(i % 70 == 0)
												 saveMaps();
											if(i === block.tx.length){
   												clearInterval(refreshIntervalId);
												} }, 5000 );

	var iterateTxs = function(currTx, tx){
		if(txMap.has(tx[currTx])) {
			console.log("currTx " + currTx);
			insightService.getTransaction(tx[currTx], storeResult);
		}
	}

	var saveMaps = function() {
		fs.unlinkSync('feesByBlock.txt');
		console.log('successfully deleted feesByBlock.txt');
		fs.unlinkSync('procesed.txt');
		console.log('successfully deleted processed.txt');

		var keys = feesByBlock.keys();
		for(var i = 0; i < keys.length; i++) {
			var mapEntry = keys[i] + ' ' + feesByBlock.get(keys[i]);
			fs.appendFile('feesByBlock.txt', mapEntry + ';', function (err) {});
		}
		var keys2 = procesed.keys();
		for(var j = 0; j < keys2.length; j++) {
			var mapEntry2 = keys2[j] + ' ' + procesed.get(keys2[j]);
			fs.appendFile('procesed.txt', mapEntry2 + ';', function (err) {});
		}
	}
}

var txHandler = function (txid) {
	txMap.set(txid, lastBlockHeight);
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

var estimateFee = function(nBlocks, txSize) {
	if(nBlocks <= 0){
		return 0;
	}

	var points = [];
	var fee;
	var feePerByte = feesByBlock.get(nBlocks);
	if(!feePerByte){
		feesByBlock.forEach(function(value, key) {
    		points.push([parseInt(key), parseFloat(value)]);
		});
		f = interpolatingPolynomial(points);
		fee = f(nBlocks);
	} else {
		fee = feePerByte;
	}

	return txSize ? fee*txSize: fee;
}

var initialize = function() {

	var feesByBlockContent = fs.readFileSync('feesByBlock.txt', 'utf8');
	console.log(feesByBlockContent);

	var entries = feesByBlockContent.split(";");
	for(var i = 0; i < entries.length - 1; i++) {
		var keyvalue = entries[i].split(' ');
		feesByBlock.set(keyvalue[0], keyvalue[1]);
	}

	var procesedContent = fs.readFileSync('procesed.txt', 'utf8');
	var entries2 = procesedContent.split(";");
	for(var j = 0; j < entries2.length - 1; j++) {
		var keyvalue2 = entries2[j].split(' ');
		procesed.set(keyvalue2[0], keyvalue2[1]);
	}

	insightService.getLastBlock(function(block) {
		lastBlockHeight = block.height;
		console.log(block.height);
	});
	
}

module.exports.txHandler = txHandler;
module.exports.estimateFee = estimateFee;
module.exports.blockHandler = blockHandler;
module.exports.prediction = prediction;
module.exports.estimateFeesByHeight = estimateFeesByHeight;
module.exports.initialize = initialize;


