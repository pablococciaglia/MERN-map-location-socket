import mapboxgl from 'mapbox-gl';
import { useCallback, useEffect, useRef, useState } from 'react';
import { v4 } from 'uuid';
import { Subject } from 'rxjs';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOXTOKEN;

const useMapbox = (initialLocation) => {
	// Reference to DIV map
	const mapDiv = useRef();
	const setRef = useCallback((node) => {
		mapDiv.current = node;
	}, []);

	// Reference to the Markers
	const markers = useRef({});

	// Observable of RxJs
	const newMarker = useRef(new Subject());
	const markerMovement = useRef(new Subject());

	// Created map and coords
	const createdMap = useRef();
	const [coords, setCoords] = useState(initialLocation);

	// Add a mark function
	const addMark = useCallback((event, id) => {
		const { lat, lng } = event.lngLat || event;
		const marker = new mapboxgl.Marker();

		marker.id = id ?? v4();
		marker.setLngLat([lng, lat]).addTo(createdMap.current).setDraggable(true);

		// Add to the marker object with the ID as key
		markers.current[marker.id] = marker;

		//If the marker has an ID do not emit
		if (!id) {
			newMarker.current.next({
				id: marker.id,
				lat,
				lng,
			});
		}

		// Listen to mark movement
		marker.on('drag', ({ target }) => {
			const { id } = target;
			const { lng, lat } = target.getLngLat();
			markerMovement.current.next({ id, lng, lat });
		});
	}, []);

	// Update marker location
	const updateIncomingLocation = useCallback(({ id, lat, lng }) => {
		markers.current[id].setLngLat({ lng, lat });
	}, []);

	useEffect(() => {
		const map = new mapboxgl.Map({
			container: mapDiv.current, // container REF
			style: 'mapbox://styles/mapbox/streets-v11', // style URL
			center: [initialLocation.lng, initialLocation.lat], // starting position [lng, lat]
			zoom: initialLocation.zoom, // starting zoom
		});
		createdMap.current = map;
	}, [initialLocation.lat, initialLocation.lng, initialLocation.zoom]);

	useEffect(() => {
		createdMap.current?.on('move', () => {
			const { lng, lat } = createdMap.current.getCenter();
			setCoords({
				lat: lat.toFixed(4),
				lng: lng.toFixed(4),
				zoom: createdMap.current.getZoom().toFixed(2),
			});
		});
		return createdMap.current?.off('move');
	}, []);

	// Add a mark on click
	useEffect(() => {
		createdMap.current?.on('click', addMark);
	}, [addMark]);

	return {
		addMark,
		coords,
		markerMovement$: markerMovement.current,
		markers,
		newMarker$: newMarker.current,
		setRef,
		updateIncomingLocation,
	};
};

export default useMapbox;
