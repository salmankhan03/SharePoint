import React, { useCallback, useEffect, useState,useRef  } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleMap, DrawingManager } from "@react-google-maps/api";

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
    setCurrentUserLocation
} from "../../store";
import _ from "lodash";

const streetViewOptions = {
    addressControl: true,
    enableCloseButton: true,
    zoomControlOptions: true,
};

const Map = () => {
    const { center, zoom, position, display, ref } = useSelector((state) => state);
    const mapTypeId = useSelector(state => state.mapTypeId);
    const searchByButtonClick = useSelector((state) => state.searchByButtonClick);
    const total = useSelector((state) => state);
    const [mapPosition, setMapPosition] = useState(position)
    const mapRef = useRef(null);
    const { rotationAngle } = useSelector((state) => state);
    const { tilt } = useSelector((state) => state);
    
    // console.log("tilt ==>",tilt)

    // console.log("rotationAngle ==>",rotationAngle)

    const dispatch = useDispatch();

    const requestLocationPermission = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const center = {
                        lat: latitude,
                        lng: longitude,
                    };
                    const zoom = 12
                    dispatch(setCurrentUserLocation({center, zoom}));
                },
                (error) => {
                    console.error("Error getting current location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        // Request location permission when the component mounts
        requestLocationPermission();
    }, []);

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
            streetViewControl: true,
            tilt: tilt=== true ? 0 :90,
            heading: rotationAngle,
          });
        }
      }, [rotationAngle,tilt])
    
      const onUnmount = useCallback(function callback(map) {
        setMap(null);
      }, []);
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
    

    const onMapClick = useCallback(
        (event) => {
          const selectedPosition ={
            lat: event.latLng.lat(),
            lng : event.latLng.lng(),
         }
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: selectedPosition }, (results, status) => {
              if (status === 'OK') {
                  if (results[0]) {
                      console.log('results----------------===============', results)
                      dispatch(setAddress(results[0].formatted_address))
                      const location = results[0].geometry.location;
                      const addresses = results ? formatAddress(results[0]) : undefined;
                      dispatch(setAddressDetails(addresses))
                      console.log('results[0]?.address_components[0]?.long_name-----------------', results[0]?.address_components[0]?.long_name   )
                      // console.log("item.structured_formatting.main_text",item.structured_formatting.main_text)
                      dispatch(setLocation({
                        locationName:  results[0]?.formatted_address                       ,
                        locationDetail: results[0].formatted_address, 
                        id: results[0].place_id, 
                        lat: selectedPosition.lat, 
                        lng: selectedPosition.lng}))
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
        tilt:tilt,
        heading: rotationAngle,
        onZoomChanged: _.debounce(onZoomChanged, 500),
        onBoundsChanged: _.debounce(onBoundsChanged, 500),

    };

    return (
        <GoogleMap {...mapProps}>
           <SearchInformation/>
           <SearchMarker/>
        </GoogleMap>
    );
};

const styles = {
    map: { height: "calc(100% - 70px)" },
};

export default Map;
