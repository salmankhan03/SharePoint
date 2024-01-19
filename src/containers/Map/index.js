import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleMap, DrawingManager } from "@react-google-maps/api";

import SearchInformation from './SearchInformation'
import SearchMarker from "./SearchMarker";
import { setAddress, setLocation, setSelectedMapHideShow } from "../../store";

const streetViewOptions = {
    addressControl: true,
    enableCloseButton: true,
    zoomControlOptions: true,
};

const Map = () => {
    const { center, zoom, position, display } = useSelector((state) => state);
    const mapTypeId = useSelector(state => state.mapTypeId);
    const searchByButtonClick = useSelector((state) => state.searchByButtonClick);
    const total = useSelector((state) => state);
    const [mapPosition, setMapPosition] = useState(position)
    const dispatch = useDispatch();

    useEffect(() => {
        setMapPosition(position)
    }, [position])

    const [map, setMap] = useState(null);
    const onLoad = useCallback(
        (map) => {
            setMap(map);
        },
        [setMap]
    );

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);

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
                      dispatch(setAddress(results[0].formatted_address))
                      const location = results[0].geometry.location;
                    //   console.log("item.structured_formatting.main_text",item.structured_formatting.main_text)
                      dispatch(setLocation({
                        locationName:  results[0]?.address_components[0]?.long_name                       , 
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
            disableDefaultUI: true,
            draggableCursor: searchByButtonClick ? 'crosshair' : 'grab',
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [
                        {
                            visibility: "off",
                        },
                    ],
                },
            ],
        },
        onClick: searchByButtonClick ? onMapClick : undefined, // Only attach onClick if searchByButtonClick is true
        onLoad,
        onUnmount,
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
