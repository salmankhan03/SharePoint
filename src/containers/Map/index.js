import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { GoogleMap, DrawingManager } from "@react-google-maps/api";

import SearchInformation from './SearchInformation'
import SearchMarker from "./SearchMarker";

const streetViewOptions = {
    addressControl: true,
    enableCloseButton: true,
    zoomControlOptions: true,
};

const Map = () => {
    const { center, zoom, position, display } = useSelector((state) => state);
    const mapTypeId = useSelector(state => state.mapTypeId);
    const total = useSelector((state) => state);
    const [mapPosition, setMapPosition] = useState(position)

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
        },
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
