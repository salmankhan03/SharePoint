import React, { useState, useEffect } from 'react';
import {useDispatch, useSelector} from 'react-redux';
import { Marker } from '@react-google-maps/api';
import icon from './icon';
import {setAddress, setPosition} from "../../store";

const SearchMarker = () => {
    const position = useSelector((state) => state.position);
    const [locationName, setLocationName] = useState(null);

    const dispatch = useDispatch();

    useEffect(() => {
        if (position) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        dispatch(setAddress(results[0].formatted_address))
                        setLocationName(results[0].formatted_address);
                    }
                } else {
                    console.error('Geocoder failed due to: ' + status);
                }
            });
        }
    }, [position]);

    const onMarkerDragEnd = (e) => {
        const newPosition = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
        };

        dispatch(setPosition(newPosition))
    };

    return (
        position && (
            <>
                <Marker
                    position={position}
                    icon={icon}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                />
                {locationName && (
                    <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', background: 'white', padding: '5px', borderRadius: '5px' }}>
                        {locationName}
                    </div>
                )}
            </>
        )
    );
};

export default SearchMarker;
