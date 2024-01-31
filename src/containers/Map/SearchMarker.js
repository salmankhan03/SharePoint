import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Marker } from '@react-google-maps/api';
import icon from './icon';
import { onHideShowInfo, setAddress, setAddressDetails, setPosition } from "../../store";

const SearchMarker = () => {
    const position = useSelector((state) => state.position);
    const [locationName, setLocationName] = useState(null);

    const dispatch = useDispatch();
    const formatAddress = input => {
        const structuredAddress = input?.address_components?.reduce(
            (result, item) => ({ ...result, [item.types]: item.short_name }),
            {}
        );
        let formattedAddress = '';
        if (structuredAddress['street_number']) {
            formattedAddress = formattedAddress + structuredAddress['street_number'] + ' ';
        }
        if (structuredAddress['route']) {
            formattedAddress = formattedAddress + structuredAddress['route'] + ', ';
        }
        if (structuredAddress['locality,political']) {
            formattedAddress = formattedAddress + structuredAddress['locality,political'] + ' ';
        }
        if (structuredAddress['administrative_area_level_1,political']) {
            formattedAddress =
                formattedAddress + structuredAddress['administrative_area_level_1,political'];
        }
        return { structuredAddress, formattedAddress};
    }; 

    useEffect(() => {
        if (position) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        const addresses = results ? formatAddress(results[0]) : undefined;
                        dispatch(setAddressDetails(addresses))
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
    const showInfo= () =>{
        dispatch(onHideShowInfo(true));
    }
    return (
        position && (
            <>
                <Marker
                    position={position}
                    icon={icon}
                    draggable={true}
                    onDragEnd={onMarkerDragEnd}
                    onClick={showInfo}
                />
            </>
        )
    );
};

export default SearchMarker;
