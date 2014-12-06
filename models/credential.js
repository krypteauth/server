var mongoose = require('mongoose'),
	_ = require('async')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Credential = new Schema({
	key: String
});

module.exports = exports = Credential