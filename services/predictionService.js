var insightService = require('./insightService.js');

var prediction = function(){
	console.log(insightService.getLastBlock());
}

module.exports.prediction = prediction;

