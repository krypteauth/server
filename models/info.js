var mongoose = require('mongoose')

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;

var Info = new Schema({
	key: String,
	value: String
});

module.exports = exports = Info