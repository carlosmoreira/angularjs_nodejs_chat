var express = require('express')
  , app = express()
  , http = require('http')
  , server = http.createServer(app)
  , io = require('socket.io').listen(server);

server.listen(8080);

// routing
app.get('/', function (req, res) {
  //res.sendfile(__dirname + '/index.html');
});

// usernames which are currently connected to the chat
var usernames = {};

// rooms which are currently available in chat //DELETE
var rooms = ['room1'];

io.sockets.on('connection', function (socket) {
	//console.log('connected', socket);

	// when the client emits 'room', this listens and executes
	socket.on('room', function(data){
		console.log("onRoom",data);

		// store the data in the socket session for this client
		socket.user = data.user;

		// store the room name in the socket session for this client
		socket.room = data.room;

		// send client to room 1
		socket.join(data.room);

		// echo to client they've connected
		socket.emit('updatechat', {
			user : data.user,
			text : "....Has Connected!"
		});

		// echo to room 1 that a person has connected to their room
		//socket.broadcast.to(data.room).emit('updatechat', 'SERVER', data + ' has connected to this room');

	});
	
	// when the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		console.log("sendChat From: ", socket.user);
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat',{
			user : data.user,
			text : data.text
		});
	});

	// when the user disconnects.. perform this
	socket.on('disconnect', function(){
		// remove the username from global usernames list
		delete usernames[socket.username];
		// update list of users in chat, client-side
		io.sockets.emit('updateusers', usernames);
		// echo globally that this client has left
		socket.broadcast.emit('updatechat', 'SERVER', socket.username + ' has disconnected');
		socket.leave(socket.room);
	});
});
