// import React, { useCallback } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import InfoCard from '../../components/InfoCard';
// import InfoBox from "./Infobox";
// import {closeInfo} from "../../store";
// import Summary from "../../components/Summary";
//
// const SearchInfo = ({ locationDetail, locationName, position, display }) => {
//     const dispatch = useDispatch();
//     const onClose = useCallback(() => {
//         dispatch(closeInfo());
//     }, [dispatch]);
//     const locationDetails = [
//         {locationDetail: locationDetail}
//     ]
//     console.log('position---------------------------------------===========', position)
//     return (
//         <InfoCard title={locationDetail} onClose={onClose} locationName={locationName}  position={position} display={display}>
//             {/*<Summary dataSource={locationDetails} />*/}
//             {/*<Actions actions={actions} onDelete={editable && onDelete} />*/}
//         </InfoCard>
//     );
// };
//
// const SearchInformation = () => {
//     const dispatch = useDispatch();
//     const position = useSelector((state) => state.position);
//     const locationName = useSelector((state) => state.locationName);
//     const locationDetail = useSelector((state) => state.locationDetail);
//     const display = useSelector((state) => state.display);
//
//     const onClose = useCallback(() => {
//         // Clear locationDetail when closing
//         dispatch(closeInfo());
//     }, [dispatch]);
//
//     if (!position) {
//         return null; // Don't render anything if position is falsy
//     }
//
//     return (
//         <InfoBox visible={display} position={position}>
//             {/*<SearchInfo locationName={locationName} display={display} locationDetail={locationDetail} position={position} onClose={onClose} />*/}
//         </InfoBox>
//     );
// };
//
// export default SearchInformation;
//


import React, {useCallback, useState} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import _ from 'lodash';

import InfoBox from './Infobox';
import InfoCard from '../../components/InfoCard';
import Summary from '../../components/Summary';
import {addSiteDetail, closeInfo} from "../../store";
import Thumbnails from "./Thumbnails";
import { Button } from "antd";
import { Row, Col } from "antd";

// import Icon from "../Icon";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";

const border = '#264475';
// import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
// import Actions from '../../components/Actions';

// import {
//     selectStudyArea,
//     confirmDeleteStudyArea,
//     dropStudyArea,
//     deleteStudyArea
// } from '../../actions/studyareas';
// import { startReportWizard } from '../../actions/reportwizards';
// import { setDrawer, setDrawerTab } from '../../actions/drawers';
// import selectedStudyAreaSelector from '../../selectors/selected_studyarea_selector';
//
// import infoActions from '../../helpers/info_actions';
// import infoEditActions from '../../helpers/info_edit_actions';
// import Thunder from '../../assets/icons/Thunder';

const StudyAreas = ({ visible, locationDetail, position }) => {
    // const { id, name, isTemp, analog, type, rings } = studyArea;
    // console.log('id in sa info:', id);
    const [button, setButton] = useState('select')
    const dispatch = useDispatch();
    const onClose = useCallback(() => {
        dispatch(closeInfo());
    }, [dispatch]);

    // const onClose = useCallback(
    //     () => (dispatch(closeInfo(id))),
    //     [dispatch, id]
    // );

    // const profile = useCallback(() => {
    //     dispatch(setDrawerTab('Project', 'profile'));
    //     dispatch(setDrawer('right', 'Project'));
    // }, [dispatch]);
    // const onDelete = useCallback(() => dispatch(confirmDeleteStudyArea(id)), [dispatch, id]);
    // const buttons = isTemp
    //     ? [
    //         {
    //             icon: Thunder,
    //             label: 'Report',
    //             onClick: () => {
    //                 dispatch(startReportWizard());
    //                 dispatch(dropStudyArea({ position, path: 'reportInput' }));
    //             }
    //         }
    //     ]
    //     : [{ icon: 'bar-chart', label: 'View Data', onClick: profile, disabled: isTemp }];
    // const isPolygon = type === 'PolygonArea' || type === 'DriveTimeArea';
    // const editable = !isTemp;
    // const isArea = editable || isPolygon;
    // const actions = infoActions(dispatch, position, isArea, id).concat(
    //     infoEditActions(dispatch, isPolygon, editable, rings[0].geometry.type && studyArea)
    // );

    const onClick = (e) => {
        e.stopPropagation();
        dispatch(addSiteDetail())
        setButton('remove')

    }

    const span = 24 / '100%';
    console.log('locationDetail----------------', locationDetail)
    return (
        <InfoCard title={locationDetail} onClose={onClose} visible={visible}  position={position}>
            <Thumbnails />
            {<Summary dataSource={locationDetail} />}
            <Col span={span} style={{ ...styles.columnWithBorder }}>
                <Button
                    type={'primary'}
                    className={
                            "sitewise-info-details-button"
                    }
                    onClick={(e) => button === 'select' ? onClick(e) : 'none'}
                    // disabled={disabled}
                    style={styles.button}
                >
                    {button === 'select' ? 'Select' : 'Remove' }
                        {/*<EditOutlined style={{ fontSize: 16, ...styles.icon }}/>*/}
                </Button>
            </Col>
        </InfoCard>
    );
};

const StudyAreaInfo = () => {
    // const studyArea = useSelector(selectedStudyAreaSelector);
    // const position = _.get(studyArea, 'position');
    const position = useSelector((state) => state.center);
//     const locationName = useSelector((state) => state.locationName);
    const locationDetail = useSelector((state) => state.locationDetail);
    const { display } = useSelector((state) => state);
    // const { selected } = useSelector((state) => state);
    // console.log('selected----------------', selected)
//     const display = useSelector((state) => state.display);
    return (
        <InfoBox visible={position} position={position}>
            <StudyAreas locationDetail={locationDetail} position={position} />
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
    },
};


export default StudyAreaInfo;

