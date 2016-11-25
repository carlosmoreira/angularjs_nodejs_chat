var  io = require('socket.io')(8080);

io.sockets.on('connection', function (socket) {

	// when the client emits 'room', this listens and executes
	socket.on('room', function(data){
		console.log("onRoom",data);

		// store the username for each response in the socket session
		socket.user = data.user;

		// store the room name in the socket session for this client
		socket.room = data.room;

		// send client to room 1
		socket.join(data.room);

		// tell client user has connected
		socket.emit('updatechat', {
			user : socket.user,
			text : "....Has Connected!"
		});
	});
	
	// When the client emits 'sendchat', this listens and executes
	socket.on('sendchat', function (data) {
		console.log("sendChat From: ", socket.user);
		// we tell the client to execute 'updatechat' with 2 parameters
		io.sockets.in(socket.room).emit('updatechat',{
			user : socket.user,
			text : data.text
		});
	});

	// When the user disconnects.. perform this
	socket.on('disconnect', function(){
		// let client know user has disconnected
		socket.broadcast.emit('updatechat', {user : socket.user , text : 'has disconnected', disconnect : true});
		socket.leave(socket.room);
	});
});
