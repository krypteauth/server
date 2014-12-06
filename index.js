var db = require('./db')(),
	config = require('./config'),
	server = require('./server')

var port = process.env.PORT || config.port || 5000;
server().listen(port, function () {
	console.log('authy server: running on ' + port + ' ('+config.env+')');
});