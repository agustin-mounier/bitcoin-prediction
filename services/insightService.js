var http = require('http');

var options = {
  host: 'localhost',
  port: 3001,
  path: '/insight-api/block-index/0',
  method: 'GET',
  headers: {
      'Content-Type': 'application/json'
  }
};

var getLastBlock = function(){
	  var req = http.get(options, function(res) {
		  console.log('STATUS: ' + res.statusCode);
		  res.on('data', function (data) {
		  	return JSON.parse(data);
		  });
	});

}

module.exports.getLastBlock = getLastBlock;
