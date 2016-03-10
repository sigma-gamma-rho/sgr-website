/*

Author: Purnell Jones
File: server.js
Descripton: Retrieve data passed by jQuery to store into MongoLab using the Mongoose Modules 
Tutorial Author: Smitha Milli
Tutorial Link: https://www.youtube.com/watch?v=pNKNYLv2BpQ

*/


var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	//Part 2 - Holds all the peoples name in the chat
	var nicknames = [];
	// Part 3 - connects to MongoLabs
	var mongoose = require('mongoose');

	mongoose.connect('mongodb://TA:password@ds023118.mlab.com:23118/chat', 
		function(err){
			if(err){
				console.log(err);
			}
			else{
				console.log('Connected to MongoLab');
			}
	});
// Part 3 - chat Schema model
var chatSchema = mongoose.Schema({
	nick: String,
	msg: String,
	created: {type: Date, default: Date.now}
});

//model
var Chat = mongoose.model('Message', chatSchema)

server.listen(3000, function(){
	console.log('Listening to PORT:3000');
});

/* Routing for root directory */
app.get('/', function(req, res){

	res.sendFile(__dirname + '/index.html');
});

// Routing for the CSS file 
app.get('/css/style.css', function(req,res){
	res.sendFile(__dirname + '/css/style.css');
});
// Routing for jQuery JavaScript file
app.get('/js/chatScript.js', function(req,res){
	res.sendFile(__dirname + '/js/chatScript.js');
});

/* Receive message on the server side */
io.sockets.on('connection', function(socket){
	// Retrieves messages while waiting to log in (May not be needed in actual web app)
	var query = Chat.find({});
	// Sets limit on how many message are receive when connected
	query.sort('-created').limit(8).exec(function(err, docs){
		if(err) throw err;
		socket.emit('load old msgs', docs);
	});
	/* Part2 - Received event from message from*/
	socket.on('new user', function(data, callback){
		console.log('');
		//checks if nickname already exist fail
		if(nicknames.indexOf(data) != -1){
			callback(false);
		}
		else{	
			callback(true);
			// adds new nickname to the socket
			socket.nickname = data;
			// adds nickname to the socket
			nicknames.push(socket.nickname);
			// Adds nickname for all users to see in the chat room
			io.sockets.emit('usernames', nicknames);
		}
	});
	// Updates the list of active Users
	function updateNickNames(){
		io.sockets.emit('usernames', nicknames);
	}
	// Send message to ever other user logged on
	socket.on('send message', function(data){
		var msg = data.trim();
		var newMsg = new Chat({msg: msg, nick: socket.nickname});
			newMsg.save(function(err){
			if(err) throw err;
				io.sockets.emit('new message', {nick: socket.nickname, msg: msg});
		});
	});

	// Handles users who disconnects
	socket.on('disconnect', function(data){
		// Check if nickname exist
		if(!socket.nickname) return;
		// Removes the nicknmae from the array of nicknames
		nicknames.splice(nicknames.indexOf(socket.nicknames),1);
		// Updates username list in the client side
		updateNickNames();
	});
});