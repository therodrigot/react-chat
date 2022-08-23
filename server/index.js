const express = require('express');
const app = express();
const PORT = 4001;

//New imports
const http = require('http').createServer(app);
const cors = require('cors');

app.use(cors());

app.get('/api', (req, res) => {
	res.json({
		message: 'Hello world',
	});
});

app.get('/', (req, res) => {
	res.send('<h1>Hello world</h1>');
});

http.listen(PORT, () => {
	console.log(`Server listening on ${PORT}`);
});

const socketIO = require('socket.io')(http, {
	cors: {
		origin: "http://localhost:3000"
	}
});


//Add this before the app.get() block
let users = [];
socketIO.on('connection', (socket) => {
	console.log(`⚡: ${socket.id} user just connected!`);

	//Listens and logs the message to the console
	socket.on('message', (data) => {
		socketIO.emit('messageResponse', data);
	});


	socket.on('newUser', (data) => {
		//Adds the new user to the list of users
		users.push(data);

		//Sends the list of users to the client
		socketIO.emit('newUserResponse', users);
	});

	socket.on('typing', (data) => {
		socket.broadcast.emit('typingResponse', data)
	});

	socket.on('disconnect', () => {
		console.log('🔥: A user disconnected');
	});
});
