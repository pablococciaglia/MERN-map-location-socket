import React from 'react';
import SocketProvider from './context/SocketContext';
import MapPage from './pages/MapPage';

const MapLocatorApp = () => {
	return (
		<SocketProvider>
			<MapPage />
		</SocketProvider>
	);
};

export default MapLocatorApp;
