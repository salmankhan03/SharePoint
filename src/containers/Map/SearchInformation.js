import React, { useCallback, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import InfoBox from './Infobox';
import InfoCard from '../../components/InfoCard';
import { addSiteDetail, closeInfo, setSelectedMapHideShow, onHideShowInfo } from "../../store";
import { Button } from "antd";
import { Col } from "antd";
const border = '#264475';


const StudyAreas = ({ visible, locationDetail, position, locationName }) => {
    const [button, setButton] = useState('select')
    const contactScreenShowHide = useSelector((state) => state.contactScreenShowHide);
    const validateData = useSelector((state) => state.validateData);
    const [hovered, setHovered] = useState(false);
    const [btnBackgroundColor, setBtnBackgroundColor] = useState()
    const [btnFamily, setBtnFamily] = useState()
    const [fontFamily, setFontFamily] = useState()
    const [fontColor, setFontColor] = useState()
    const [btnHoverColor, setBtnHoverColor] = useState()
    const [btnHoverFamily, setBtnHoverFamily] = useState()
    const dispatch = useDispatch();
    const onClose = useCallback(() => {
        dispatch(closeInfo());
        dispatch(setSelectedMapHideShow(false));
    }, [dispatch]);
    useEffect(() => {
        onClick()
        if (validateData?.siteStyle) {
            const styleRegex = /font-family:\s*([^;]*)/;
            const colorRegex = /color:\s*([^;]*)/;
            const bgColorRegex = /background-color:\s*([^;]*)/;

            const extractStyle = (styleString, regex) => {
                const match = styleString.match(regex);
                return match ? match[1].trim() : null;
            };

            const buttonStyle = validateData?.siteStyle?.buttonStyle;
            const buttonHoverStyle = validateData?.siteStyle?.buttonHover;
            const fontFamily = validateData?.siteStyle?.fontGeneral;
            const fontColor = validateData?.siteStyle?.fontGeneral;
            const btnBackgroundColor = extractStyle(buttonStyle, bgColorRegex);
            const btnFontFamily = extractStyle(buttonStyle, styleRegex);
            const btnHoverBackgroundColor = extractStyle(buttonHoverStyle, bgColorRegex);
            const btnHoverFontFamily = extractStyle(buttonHoverStyle, styleRegex);
            const generelFontFamily = extractStyle(fontFamily, styleRegex);
            const generelfontsColor = extractStyle(fontColor, colorRegex);
            if (btnBackgroundColor) {
                setBtnBackgroundColor(btnBackgroundColor);
            }

            if (btnFontFamily) {
                setBtnFamily(btnFontFamily);
            }

            if (btnHoverBackgroundColor) {
                setBtnHoverColor(btnHoverBackgroundColor);
            }

            if (btnHoverFontFamily) {
                setBtnHoverFamily(btnHoverFontFamily);
            }
            if (generelFontFamily) {
                setFontFamily(generelFontFamily);
            }
            if (generelfontsColor) {
                setFontColor(generelfontsColor)
            }
        }

    }, [])
    const onHide = useCallback(() => {
        dispatch(onHideShowInfo(false));
    }, [dispatch]);

    const onClick = (e) => {
        // e.stopPropagation();
        dispatch(addSiteDetail())
        setButton('remove')
    }

    const handleMouseEnter = () => {
        setHovered(true);
    };
    const handleMouseLeave = () => {
        setHovered(false);
    };

    const span = 24 / '100%';
    return (
        <InfoCard title={locationName} onClose={onHide} visible={contactScreenShowHide} position={position} fontFamily={fontFamily} fontColor={fontColor}>
            {/*<Thumbnails />*/}
            {/*{<Summary dataSource={locationDetail} />}*/}
            <Col span={span} className={'columnButtons'} style={{ ...styles.columnWithBorder }}>
                <Button
                    onClick={(e) => button === 'select' ? onClick(e) : onClose()}
                    disabled={contactScreenShowHide}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    style={{
                        ...styles.button,
                        fontFamily: btnFamily ? (hovered ? btnHoverFamily : btnFamily) : '',
                        backgroundColor: btnBackgroundColor ? (contactScreenShowHide ? 'white' : (hovered ? btnHoverColor : 'white')) : (hovered ? '#0087b7' : 'white'),
                        color: btnBackgroundColor ? (contactScreenShowHide ? '#ccc' : (hovered ? 'white' : (btnBackgroundColor ? btnBackgroundColor : 'black'))) : (hovered ? 'white' : '#0087b7'),
                        borderColor: btnBackgroundColor ? (contactScreenShowHide ? '#ccc' : (hovered ? "white" : (btnBackgroundColor ? btnBackgroundColor : 'transparent'))) : (hovered ? 'white' : '#0087b7'),
                        border: btnBackgroundColor ? '1px solid' + btnBackgroundColor : '1px solid #0087b7',
                        borderRadius: '6px'

                    }}
                    className={
                        btnBackgroundColor ? "" : "sitewise-info-remove-details-button"
                    }
                >
                    {button === 'select' ? 'Select' : 'Remove'}
                </Button>
            </Col>
        </InfoCard>
    );
};

const StudyAreaInfo = () => {
    const position = useSelector((state) => state.position);
    const locationName = useSelector((state) => state.locationName);
    const locationDetail = useSelector((state) => state.locationDetail);
    // Before Code 
    // const { display } = useSelector((state) => state);
    // warning resolve After
    const display  = useSelector((state) => state?.display);
    return (
        <InfoBox visible={display} position={position}>
            <StudyAreas locationDetail={locationDetail} position={position} locationName={locationName} />
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

