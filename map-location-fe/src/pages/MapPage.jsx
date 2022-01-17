import { useContext, useEffect } from 'react';
import { SocketContext } from '../context/SocketContext';
import useMapbox from '../hooks/useMapbox';

const initialLocation = {
	lng: -4,
	lat: 40,
	zoom: 6,
};

/* active-markers*/

const MapPage = () => {
	const { socket } = useContext(SocketContext);
	const {
		addMark,
		coords,
		markerMovement$,
		newMarker$,
		setRef,
		updateIncomingLocation,
	} = useMapbox(initialLocation);

	// Recive the active markers
	useEffect(() => {
		socket.on('active-markers', (markers) => {
			for (const key of Object.keys(markers)) {
				addMark(markers[key], key);
			}
		});
	}, [addMark, socket]);

	// Create a marker
	useEffect(() => {
		newMarker$.subscribe((marker) => {
			socket.emit('add-new-marker', marker);
		});
	}, [newMarker$, socket]);

	// Move a marker
	useEffect(() => {
		markerMovement$.subscribe((marker) => {
			socket.emit('update-marker', marker);
		});
	}, [markerMovement$, socket]);

	// Listen to a new marker
	useEffect(() => {
		socket.on('add-new-marker', (marker) => {
			addMark(marker, marker.id);
		});
	}, [addMark, socket]);

	// Listen to marker movement
	useEffect(() => {
		socket.on('update-marker', (marker) => {
			updateIncomingLocation(marker);
		});
	}, [socket, updateIncomingLocation]);

	return (
		<>
			<div className='info'>
				lng: {coords.lng} | lat: {coords.lat} | zoom: {coords.zoom}
			</div>
			<div ref={setRef} className='mapContainer'></div>
		</>
	);
};

export default MapPage;
