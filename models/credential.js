var mongoose = require('mongoose'),
	_ = require('async')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Credential = new Schema({
	key: String,
	kind: String
});

module.exports = exports = Credential