var mongoose = require('mongoose'),
	_ = require('async')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Token = new Schema({
	token: String,
	expires: Number,
   	permissions: [String],
   	provider: String
});

module.exports = exports = Token
