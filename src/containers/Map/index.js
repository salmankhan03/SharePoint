import React, { useCallback, useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleMap } from "@react-google-maps/api";

import SearchInformation from './SearchInformation'
import SearchMarker from "./SearchMarker";
import {
    setAddress,
    setLocation,
    setSelectedMapHideShow,
    setMapZoom,
    setMapBounds,
    saveMapRef,
    setAddressDetails,
} from "../../store";
import _ from "lodash";

const Map = () => {
    // Before Code 
    // const { center, zoom, position, display, ref } = useSelector((state) => state);
    // warning resolve After
    const center = useSelector((state) => state.center);
    const zoom = useSelector((state) => state.zoom);
    const position = useSelector((state) => state.position);

    const mapTypeId = useSelector(state => state.mapTypeId);
    const searchByButtonClick = useSelector((state) => state.searchByButtonClick);
    // this state is not useble
    // const total = useSelector((state) => state);
    const [mapPosition, setMapPosition] = useState(position)
    const mapRef = useRef(null);
    // Before Code 
    const { rotationAngle } = useSelector((state) => state);
    // warning resolve After
    // const rotationAngle = useSelector((state) => state?.rotationAngle);
    // Before Code 
    // const { tilt } = useSelector((state) => state);
    // warning resolve After
    const  tilt  = useSelector((state) => state?.tilt);

    const dispatch = useDispatch();

    useEffect(() => {
        setMapPosition(position)
    }, [position])

    const [map, setMap] = useState(null);
    const onLoad = useCallback(
        (map) => {
            dispatch(saveMapRef(map))
            setMap(map);
            mapRef.current = map;
        },
        [setMap, dispatch]
    );
    const onZoomChanged = useCallback(() => dispatch(setMapZoom()), [dispatch]);
    const onBoundsChanged = useCallback(
        () => dispatch(setMapBounds()),
        [dispatch]
    );

    useEffect(() => {
        const map = mapRef.current;
        if (map) {
            map.setOptions({
                gestureHandling: 'greedy',
                // rotateControl: true,
                streetViewControl: false,
                rotateControl: false,
                tilt: tilt === true ? 0 : 90,
                heading: rotationAngle,
            });
        }
    }, [rotationAngle, tilt])

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);
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


    const onMapClick = useCallback(
        (event) => {
            const selectedPosition = {
                lat: event.latLng.lat(),
                lng: event.latLng.lng(),
            }
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode({ location: selectedPosition }, (results, status) => {
                if (status === 'OK') {
                    if (results[0]) {
                        dispatch(setAddress(results[0].formatted_address))
                        const addresses = results ? formatAddress(results[0]) : undefined;

                        const addressComponents = results[0].address_components;

                        let city, state, country, zipcode, premise, political, sublocality, streetNumber, route;

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

                        dispatch(setAddressDetails({ city, state, country, zipcode, addresses }))
                        dispatch(setLocation({
                            locationName: results[0]?.formatted_address,
                            locationDetail: results[0].formatted_address,
                            id: results[0].place_id,
                            lat: selectedPosition.lat,
                            lng: selectedPosition.lng
                        }))
                        dispatch(setSelectedMapHideShow(false));

                    }
                } else {
                    console.error('Geocoder failed due to: ' + status);
                }
            });

        },
        []
    );

    const mapProps = {
        mapContainerStyle: { ...styles.map },
        mapTypeId,
        zoom,
        center,
        options: {
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            streetViewControl: false,
            clickableIcons: false,
            disableDefaultUI: true,
            draggableCursor: searchByButtonClick ? 'crosshair' : 'grab',
            gestureHandling: 'greedy',
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        {
                            visibility: "on",
                        },
                    ],
                },
            ],
        },
        onClick: searchByButtonClick ? onMapClick : undefined, // Only attach onClick if searchByButtonClick is true
        onLoad,
        onUnmount,
        tilt: tilt,
        heading: rotationAngle,
        onZoomChanged: _.debounce(onZoomChanged, 500),
        onBoundsChanged: _.debounce(onBoundsChanged, 500),

    };

    return (
        <GoogleMap {...mapProps}>
            <SearchInformation />
            <SearchMarker />
        </GoogleMap>
    );
};

const styles = {
    map: { height: "calc(100% - 70px)" },
};

export default Map;
