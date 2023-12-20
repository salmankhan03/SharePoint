import React from 'react';
import { InfoWindow } from '@react-google-maps/api';

const infoWindowOptions = {
    // disableAutoPan: true, // TODO: fix auto-pan not working when infowindow collides with layers drawer
    pixelOffset: new window.google.maps.Size(208, 38)
};

const InfoBox = ({ visible, position, children }) => {
    console.log('visible------------', visible)
    if (visible && position) {
        return (
            <InfoWindow position={position} options={infoWindowOptions}>
                {children}
            </InfoWindow>
        );
    }
    return null;
};

export default InfoBox;
