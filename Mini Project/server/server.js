var express = require('express');
var app = express();
var http = require('http').Server(app);
var socket = require('socket.io')(http);

// static port
var port = 02468;
var id;
// serve static page, use public folder
app.use('/', express.static('public'));

http.listen(port, 'localhost', function(){
	console.log("listening at *:02468");
});

socket.on('connection', function(socket) {
	console.log("connected.");

	//socket.on('msg', function(val){
		id = setInterval(function() {
			socket.emit('Temperature',Math.random());
			socket.emit('Humidity', Math.random());
			socket.emit('uv', Math.random());
		}, 1000);
//	});

	socket.on('disconnect', function() {
		clearInterval(id);
	});
});