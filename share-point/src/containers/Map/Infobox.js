import React from "react";
import { InfoWindow } from "@react-google-maps/api";
import "../../App.css";

const infoWindowOptions = {
    // disableAutoPan: true, // TODO: fix auto-pan not working when infowindow collides with layers drawer
    pixelOffset: new window.google.maps.Size(208, 38),
};

const InfoBox = ({ visible, position, children }) => {
    console.log("visible in box:", visible, " and position: ", position);
    if (visible) {
        if (position !== undefined) {
            return (
                <InfoWindow position={position} options={infoWindowOptions}>
                    {children}
                </InfoWindow>
            );
        }
    }
    return null;
};

export default InfoBox;
