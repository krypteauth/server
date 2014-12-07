var mongoose = require('mongoose');
var models = require('./models');

var config = require('./config');

module.exports = exports = function() {

	mongoose.connect(process.env.MONGO_PORT_27017_TCP_ADDR || config.db);
	
	for (var model in models) {
		mongoose.model(model, models[model])
	}

	return mongoose
};