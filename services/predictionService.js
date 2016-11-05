var insightService = require('./services/insightService.js');

var prediction = function(){
	console.log(insightService.getLastBlock());
}

module.exports.prediction = prediction;

