/*

Author: Purnell Jones
File: chatScript.js
Descripton: Access the id tags from chat HTML page to modify, append and update the chat window.
Tutorial Author: Smitha Milli
Tutorial Link: https://www.youtube.com/watch?v=pNKNYLv2BpQ

*/

jQuery(function($){
	// passed by socket.io.js import script
	var socket = io.connect();
	// Part 2 - Begin
	var $nickForm = $('#setNick');
	var $nickError = $('#nickError');
	var $nickBox = $('#nickname');
	// Part 2 - End
	var $messageForm = $('#send-message');
	var $messageBox = $('#message');
	var $chat = $('#chat');
	var $users = $('#users');

	/* Part 2 -Begin */
	$nickForm.submit(function(e){
		e.preventDefault();
		console.log('Part2');
		socket.emit('new user', $nickBox.val(), function(data){
			console.log('Name entered');
			if(data){
				console.log('valued name!');
				$('#nickWrap').hide();
				$('#contentWrap').show();
			}
			else{
				// Replaces what was there before with this string
				$nickError.html('That username has already been taken.');
			}

		});
		// Clear the text within the textbox
		$nickBox.val('');
	});

	// Adds users currently in the chat room list
	socket.on('usernames', function(data){
		var userInChat = '';
		for (var i = 0; i < data.length; i++) {
			userInChat += data[i] + '<br/>';
		};
		$users.html(userInChat);
	});
	/* Part 2 -End */

	$messageForm.submit(function(e){
		e.preventDefault();
		//Sends an event to the server (can be a a json)
		socket.emit('send message', $messageBox.val());
		// Clear the text within the textbox
		$messageBox.val('');
	});

	// Receives event on the user side
	socket.on('load old msgs', function(docs){
		// interates from bottom (last message) to top (most recent message)
		for (var i = docs.length-1; i >= 0; i--) {
			displayMsg(docs[i]);
		};
	});

	/* Receive the message on the client side from the database*/
	socket.on('new message' ,function(data){
		/* Displays the message using jQuery*/
		displayMsg(data);

	});

	function displayMsg(data){
		$chat.append('<b>' + data.nick + '</b>: ' + data.msg +"<br/>");
	}
});