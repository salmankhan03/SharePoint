import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Marker, Polygon } from '@react-google-maps/api';

import icon from './icon';

const SearchMarker = ({ onPolygonComplete, onMapClick = () => {} }) => {
    const position = useSelector((state) => state.position);

        return (
            position && (
                <Marker
                    position={position}
                    icon={icon}
                />
            )
        );
};

export default SearchMarker;



