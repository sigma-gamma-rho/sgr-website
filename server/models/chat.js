var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Chat Schema
var chatSchema = new Schema({
	name: {firstName: String, lastName: String},
	msg: String,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chat', chatSchema);