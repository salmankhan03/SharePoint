import React, {useState} from 'react';
import { useDispatch } from 'react-redux';

import roadmap from "../../assets/images/roadmap.jpg"
import hybrid from "../../assets/images/hybrid.jpg"
import {setMapTypeId} from "../../store";

const MapTypes = ({ width }) => {
    const dispatch = useDispatch();
    const [isHybrid, setIsHybrid] = useState(true);

    const changeMap = (name) => {
        setIsHybrid(!isHybrid);
        dispatch(setMapTypeId('mapTypeId', name));
    }
    return (
        <>
            <div style={styles.container} >
                <img
                    src={isHybrid ? hybrid : roadmap}
                    alt={isHybrid ? 'Hybrid' : 'Roadmap'}
                    style={styles.image}
                    onClick={() => changeMap(isHybrid ? 'hybrid' : 'roadmap')}
                    width="75"
                    height="75"
                />
            </div>
        </>
    );
};

const styles = {
    container: { zIndex: 40 },
    image: {borderRadius: 4}
};

export default MapTypes;
