// Express Server
const express = require('express');
const http = require('http');
const socketio = require('socket.io');
const path = require('path');

const Sockets = require('./sockets');

class Server {
	constructor() {
		this.app = express();
		this.port = process.env.PORT;

		// HTTP server
		this.server = http.createServer(this.app);

		// Sockets config
		this.io = socketio(this.server, {
			/* configuraciones */
		});
	}

	middlewares() {
		// Public directory deploy
		this.app.use(express.static(path.resolve(__dirname, '../public')));
	}

	configurarSockets() {
		new Sockets(this.io);
	}

	execute() {
		// Middlewares Init
		this.middlewares();

		// Sockets Init
		this.configurarSockets();

		// Server Init
		this.server.listen(this.port, () => {
			console.log('Server on:', this.port);
		});
	}
}

module.exports = Server;
