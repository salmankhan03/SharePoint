import React, { useEffect, useRef, useState } from "react";
import MapTypes from "../MapTypes";
import { useDispatch, useSelector } from "react-redux";
// import { Button } from "antd";
import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";
import RotationClockwiseIcon from "../../assets/icons/RotationClockwiseIcon";
import RotationRoadIcon from "../../assets/icons/RotationRoadIcon";
import RotationIcon from "../../assets/icons/RotationIcon";
import RotationAntiClockwiseIcon from "../../assets/icons/RotationAntiClockwiseIcon";


import { closeInfo, setSelectedMapHideShow,rotateMapClockwise,rotateMapAntiClockwise, rotateMapUp, setMapZoom } from "../../store";
import PrimarySquareButton from "../../components/PrimarySquareButton";
import logo from '../../assets/images/sitewise_logo_navy_border_88px.png';
import whiteLogo from '../../assets/images/sitewise_white_border_88.png';



const Shortcuts = () => {
    const dispatch = useDispatch();

    const mapTypeId = useSelector((state) => state.mapTypeId);
    const searchByButtonClick = useSelector((state) => state.searchByButtonClick);
    // const zoom = 12;
    const zoom = useSelector((state) => state.zoom);
    const validateData = useSelector((state) => state.validateData);
    const [fontFamilys, setFontFamilys] = useState()
    const [backgroundColor, setBackGroundColor] = useState()
    const [fontColor, setFontColor] = useState()
    // console.log("zoom",zoom)
    // Before Code
    const { rotationAngle } = useSelector((state) => state);
    // After Warning Resolve
    // const { rotationAngle } = useSelector((state) => state?.rotationAngle);
    //Not Useable
    // const { tilt } = useSelector((state) => state);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [rotate, setRotate] = useState(false)

    
const Button = ({ buttonStyle, ...props }) => (
    <PrimarySquareButton
      {...props}
      buttonStyle={{ left: -48, ...buttonStyle }}
    />
  );
  useEffect(()=>{
    if (validateData?.siteStyle?.fontGeneral) {
        const styleRegex = /font-family:\s*([^;]*)/;
        const backgroundRegex = /background-color:\s*([^;]*)/;
        const colorRegex = /color:\s*([^;]*)/;
    
        const extractStyle = (styleString, regex) => {
            const match = styleString.match(regex);
            return match ? match[1].trim() : null;
        };
    
        const fontGeneralStyle = validateData?.siteStyle?.fontGeneral;
        const fontFamily = extractStyle(fontGeneralStyle, styleRegex);
        const fontColor = extractStyle(fontGeneralStyle, colorRegex);
        const backgroundColor = extractStyle(validateData?.siteStyle?.backgroundStyle, backgroundRegex);
    
        if (fontFamily) {
            setFontFamilys(fontFamily);
        }

        if (backgroundColor) {
            setBackGroundColor(backgroundColor);
        }
    
        if (fontColor) {
            setFontColor(fontColor);
        }
    }
    
},[])

    const onClose = () => {
        // dispatch(endMapMeasure())
        dispatch(setSelectedMapHideShow(false));
        // dispatch(closeInfo());
    };

    const handleResize = () => {
        setWindowWidth(window.innerWidth);
    };

    useEffect(() => {
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    
  const handleOpenRotate = () => {
    // console.log("TiltUp Call",rotate)
    if(rotate === true){
        rotateUp(true)
    }else{
        rotateUp(false)
    }
    setRotate(!rotate)
  }
  const rotateUp = (data) => {

    // console.log("rotateUp rotateUp call")
    const newTilt = data;
    dispatch(rotateMapUp(newTilt))
  };

  const rotateClockwise = () => {
    // console.log("call")
    const newRotationAngle = rotationAngle - 90;
    dispatch(rotateMapClockwise(newRotationAngle))
  };

  const rotateAntiClockwise = () => {
    const newRotationAngle = rotationAngle + 90;
    // console.log("newRotationAngle ==>",newRotationAngle)
    dispatch(rotateMapAntiClockwise(newRotationAngle))
  };

    const dynamicStyle = {
        fontSize: 14,
        fontWeight: 100,
        fontFamily: 'Roboto',
        marginTop: 15,
        color: mapTypeId === 'roadmap' ? '#000' : '#fff'
    };


    return (
        <>
            <div
                style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    position: "absolute",
                    top: 0,
                    transition: "all 0.2s",
                }}
            >
                <div
                    style={{
                        position: "absolute",
                        right: `calc(100% - (${windowWidth}px - 20px))`,
                        bottom: 35,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        cursor: "pointer"
                        // right: 15,
                    }}
                >
                    {(zoom > 12 && ( mapTypeId === "hybrid")) &&
                        <div style={{marginBottom:15}}>
                            <Button
                                icon={rotate === true ? RotationRoadIcon : RotationIcon}
                                onClick={handleOpenRotate}
                                buttonStyle={rotate === true ? styles.openRoadRotation : styles.openRotation }
                                iconStyle={styles.world}
                            />
                            {rotate === true &&
                                <>
                                    <Button
                                        icon={RotationClockwiseIcon}
                                        onClick={rotateClockwise}
                                        buttonStyle={styles.clock}
                                        iconStyle={styles.world}
                                    />
                                    <Button
                                        icon={RotationAntiClockwiseIcon}
                                        onClick={rotateAntiClockwise}
                                        buttonStyle={styles.antiClock}
                                        iconStyle={styles.world}
                                    />
                                </>}
                        </div>
                      }
                    <div>
                        <MapTypes />
                    </div>
                    <div style={dynamicStyle}>Powered by
                       {mapTypeId === 'roadmap' ? <img
                            src={logo}
                            alt={"sitewise logo"}
                            width="88"
                            height="17"
                            style={{paddingLeft: 5}}
                        /> : <img
                           src={whiteLogo}
                           alt={"sitewise logo"}
                           width="88"
                           height="17"
                           style={{paddingLeft: 5}}
                       />}
                    </div>

                </div>
            </div>
            {searchByButtonClick ? (
                <div
                    style={{
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                        position: "absolute",
                        top: 80,
                        transition: "all 0.2s"
                    }}
                >
                    <div
                        style={{
                            position: "fixed",
                            left: 420,
                            // top: '15%',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'flex-start',
                            // right: 15,
                            backgroundColor: backgroundColor?backgroundColor:'#f2f8fb'
                        }}
                    >
                        <div style={styles.container} className="ant-notification-notice">
                            <div style={styles.header}>
                                <div>
                                    <div className="ant-notification-notice-message" 
                                        style={{ marginBottom: 8, 
                                                fontSize: 14,
                                                fontFamily:fontFamilys?fontFamilys:'', 
                                                color:fontColor?fontColor:'',
                                            }}
                                    >Select location</div>
                                    <div className="ant-notification-notice-description"
                                    style={{ marginBottom: 8, 
                                        fontSize: 14,
                                        fontFamily:fontFamilys?fontFamilys:'', 
                                        color:fontColor?fontColor:'',
                                    }}>Click a point on the map to select a location</div>
                                </div>
                                {/* <div onClick={onClose}>
                                    <CloseOutlined style={styles.closeIcon} />
                                </div> */}
                            </div>
                            <div style={styles.footer}>
                                <div style={styles.flex}>
                                    <button style={styles.button} type="link" onClick={onClose}>
                                        <u>Close</u>
                                    </button>
                                </div>
                            </div>
                        </div>
                        <style>
                            {`
                                .ant-notification-notice::before {
                                    content: '';
                                    width: 5px;
                                    height: 100%;
                                    position: absolute;
                                    left: 0;
                                    top: 0;
                                    background-color: ${backgroundColor ? backgroundColor : '#0087b7'};
                                }
                            `}
                        </style>
                    </div>
                </div>
            ) : null}
        </>
    );
};

const styles = {
    logoButton: { margin: "28px 28px 0 28px" },
    logo: { display: "flex" },
    sitewise: { marginLeft: 10, position: "relative", top: 6 },
    buttons: {
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
    },
    thunderbolt: { fontSize: 28, position: "relative", left: 1, top: 2 },
    flex: { display: "flex" },
    siteLogo: { fontSize: "25px", fontWeight: "bold" },
    // font: {fontSize: 14, fontWeight: 500, color: "#021E4F", fontFamily: 'Roboto', marginTop: 15 }
    container: { width: 200, marginTop: 0, fontSize: 12, padding: '6px 12px',cursor:'pointer' },
    header: { display: 'flex', justifyContent: 'space-between' },
    closeIcon: { fontSize: 16, color: '#ccc', cursor: 'pointer', marginTop: 6 },
    footer: { marginTop: 10, display: 'flex', justifyContent: 'flex-end', },
    button: { padding: 0, fontWeight: 500, color: 'red',border:'none',backgroundColor:'transparent',cursor:'pointer' },
    font: { fontSize: 14 },
    world: { fontSize: 20, backgroundColor: "white", padding: 4 },
    openRotation: {
        top: 70,
        fontSize: 20,
        borderRadius: '4px 4px 4px 4px',
        backgroundColor: "white",
        padding: 8,
        cursor: "pointer"
      },
    openRoadRotation: {
        top: 70,
        fontSize: 20,
        borderRadius: '4px 4px 0px 0px',
        backgroundColor: "white",
        padding: 8,
        cursor: "pointer"
      },
      clock: {
        top: 110,
        fontSize: 20,
        borderRadius: '0px',
        backgroundColor: "white",
        padding: 8,
        cursor: "pointer"
      },
      antiClock: {
        top: 150,
        fontSize: 20,
        borderRadius: '0px 0px 4px 4px',
        backgroundColor: "white",
        padding: 8,
        cursor: "pointer"
      },

};

export default Shortcuts;
