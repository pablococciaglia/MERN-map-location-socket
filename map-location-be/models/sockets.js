const Markers = require('./markers');

class Sockets {
	constructor(io) {
		this.io = io;

		this.markers = new Markers();

		this.socketEvents();
	}

	socketEvents() {
		// On connection
		this.io.on('connection', (socket) => {
			// Return active markers
			socket.emit('active-markers', this.markers.actives);

			// Add a new marker
			socket.on('add-new-marker', (marker) => {
				this.markers.addMarker(marker);
				socket.broadcast.emit('add-new-marker', marker);
			});

			// Update location of marker
			socket.on('update-marker', (marker) => {
				this.markers.updateMarker(marker);
				socket.broadcast.emit('update-marker', marker);
			});
		});
	}
}

module.exports = Sockets;
