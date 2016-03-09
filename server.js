var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server);
	//Part 2 - Holds all the peoples name in the chat
	var nicknames = [];

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
		io.sockets.emit('new message', {msg: data, nick: socket.nickname});
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