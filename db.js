var mongoose = require('mongoose');
var models = require('./models');

var config = require('./config');

module.exports = exports = function() {

	mongoose.connect(config.db);
	
	for (var model in models) {
		mongoose.model(model, models[model])
	}

	return mongoose
};