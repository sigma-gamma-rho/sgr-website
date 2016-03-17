var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

// Chat Schema
var chatSchema = new Schema({
	name: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Chat', chatSchema);