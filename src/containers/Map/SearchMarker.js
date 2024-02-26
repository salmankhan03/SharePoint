import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Marker } from '@react-google-maps/api';
import icon from './icon';
import { onHideShowInfo, setAddress, setAddressDetails, setPosition } from "../../store";

const SearchMarker = () => {
    const position = useSelector((state) => state.position);
    const [locationName, setLocationName] = useState(null);
    const [checkDrag, setCheckDrag] = useState(false);

    const dispatch = useDispatch();

    const formatAddress = address => {
        try {
            const structuredAddress = address.address_components.reduce(
                (result, item) => ({ ...result, [item.types]: item.short_name }),
                {}
            );
            let formattedAddress = '';
            if (structuredAddress['street_number']) {
                formattedAddress = formattedAddress + structuredAddress['street_number'] + ' ';
            }
            if (structuredAddress['route']) {
                formattedAddress = formattedAddress + structuredAddress['route'];
            }

            return formattedAddress;
        } catch (e) {
            return address.formatted_address;
        }
    };

    useEffect(() => {
        if (position && checkDrag === true) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: position }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        const addresses = results ? formatAddress(results[0]) : undefined;

                        const addressComponents = results[0].address_components;

                        let city, state, country, zipcode;

                        if (Array.isArray(addressComponents)) {

                            for (const component of addressComponents) {
                                if (component.types.includes("administrative_area_level_3") || component.types.includes("locality")) {
                                    city = component.long_name;
                                } else if (component.types.includes("administrative_area_level_1")) {
                                    state = component.long_name;
                                } else if (component.types.includes("country")) {
                                    country = component.long_name;
                                } else if (component.types.includes("postal_code")) {
                                    zipcode = component.long_name;
                                }
                            }
                        }

                        dispatch(setAddressDetails({city, state, country, zipcode, addresses }))
                        dispatch(setAddress(results[0].formatted_address))
                        setLocationName(results[0].formatted_address);
                        setCheckDrag(false)
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
        setCheckDrag(true)

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
