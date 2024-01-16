import React, {useCallback, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import InfoBox from './Infobox';
import InfoCard from '../../components/InfoCard';
import Summary from '../../components/Summary';
import {addSiteDetail, closeInfo, setSelectedMapHideShow} from "../../store";
import Thumbnails from "./Thumbnails";
import { Button } from "antd";
import { Row, Col } from "antd";
const border = '#264475';


const StudyAreas = ({ visible, locationDetail, position, locationName }) => {
    const [button, setButton] = useState('select')
    const dispatch = useDispatch();
    const onClose = useCallback(() => {
        dispatch(closeInfo());
        dispatch(setSelectedMapHideShow(false));
    }, [dispatch]);

    const onClick = (e) => {
        e.stopPropagation();
        dispatch(addSiteDetail())
        setButton('remove')
    }

    const span = 24 / '100%';
    return (
        <InfoCard title={locationName} onClose={onClose} visible={visible}  position={position}>
            {/*<Thumbnails />*/}
            {/*{<Summary dataSource={locationDetail} />}*/}
            <Col span={span} className={'columnButtons'} style={{ ...styles.columnWithBorder }}>
                <Button
                    type={'primary'}
                    className={
                        button === 'select' ? "sitewise-info-details-button" : "sitewise-info-remove-details-button"
                    }
                    onClick={(e) => button === 'select' ? onClick(e) : onClose()}
                    // disabled={disabled}
                    style={styles.button}
                >
                    {button === 'select' ? 'Select' : 'Remove' }
                </Button>
            </Col>
        </InfoCard>
    );
};

const StudyAreaInfo = () => {
    const position = useSelector((state) => state.position);
    const locationName = useSelector((state) => state.locationName);
    const locationDetail = useSelector((state) => state.locationDetail);
    const { display } = useSelector((state) => state);
    console.log('display------------------------', display)
    return (
        <InfoBox visible={display} position={position}>
            <StudyAreas locationDetail={locationDetail} position={position} locationName={locationName}/>
        </InfoBox>
    );
};

const styles = {
    columnWithBorder: {
        height: 32,
        padding: 0,
        fontSize: 14,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: "20px",
        borderRight: border,
        margin: '8px'
    },
    button: {
        width: '100%'
    }
};


export default StudyAreaInfo;

