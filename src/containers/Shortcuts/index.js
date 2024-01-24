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



const Shortcuts = () => {
    const dispatch = useDispatch();

    const mapTypeId = useSelector((state) => state.mapTypeId);
    const searchByButtonClick = useSelector((state) => state.searchByButtonClick);
    // const zoom = 12;
    const zoom = useSelector((state) => state.zoom);

    console.log("zoom",zoom)
    const { rotationAngle } = useSelector((state) => state);
    const { tilt } = useSelector((state) => state);

    const [windowWidth, setWindowWidth] = useState(window.innerWidth);
    const [rotate, setRotate] = useState(false)

    
const Button = ({ buttonStyle, ...props }) => (
    <PrimarySquareButton
      {...props}
      buttonStyle={{ left: -48, ...buttonStyle }}
    />
  );

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
    console.log("TiltUp Call",rotate)
    if(rotate === true){
        rotateUp(true)
    }else{
        rotateUp(false)
    }
    setRotate(!rotate)
  }
  const rotateUp = (data) => {

    console.log("rotateUp rotateUp call")
    const newTilt = data;
    dispatch(rotateMapUp(newTilt))
  };

  const rotateClockwise = () => {
    console.log("call")
    const newRotationAngle = rotationAngle + 90;
    dispatch(rotateMapClockwise(newRotationAngle))
  };

  const rotateAntiClockwise = () => {
    const newRotationAngle = rotationAngle - 90;
    console.log("newRotationAngle ==>",newRotationAngle)
    dispatch(rotateMapAntiClockwise(newRotationAngle))
  };

    const dynamicStyle = {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'Roboto',
        marginTop: 15,
        color: mapTypeId === 'roadmap' ? '#021E4F' : '#fff'
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
                        alignItems: 'end',
                        cursor: "pointer"
                        // right: 15,
                    }}
                >
                    {(zoom > 12 && ( mapTypeId === "hybrid")) &&
                        <div style={{marginBottom:15}}>
                            <Button
                                icon={rotate === true ? RotationRoadIcon : RotationIcon}
                                onClick={handleOpenRotate}
                                buttonStyle={styles.openRotation}
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
                    <div style={dynamicStyle}>Powered By Sitewise</div>

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
                        transition: "all 0.2s",
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
                            backgroundColor: '#f2f8fb'
                        }}
                    >
                        <div style={styles.container} className="ant-notification-notice">
                            <div style={styles.header}>
                                <div>
                                    <div className="ant-notification-notice-message" style={{ marginBottom: 8 }}>Select location</div>
                                    <div className="ant-notification-notice-description">Click a point on the map to select a location to submit</div>
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
    container: { width: 200, marginTop: 0, fontSize: 12, padding: '6px 12px' },
    header: { display: 'flex', justifyContent: 'space-between' },
    closeIcon: { fontSize: 16, color: '#ccc', cursor: 'pointer', marginTop: 6 },
    flex: { display: 'flex' },
    footer: { marginTop: 10, display: 'flex', justifyContent: 'flex-end', },
    button: { padding: 0, fontWeight: 500, color: 'red',border:'none',backgroundColor:'transparent' },
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
      clock: {
        top: 110,
        fontSize: 20,
        // borderRadius: '4px',
        backgroundColor: "white",
        padding: 8,
        cursor: "pointer"
      },
      antiClock: {
        top: 150,
        fontSize: 20,
        borderRadius: '4px',
        backgroundColor: "white",
        padding: 8,
        cursor: "pointer"
      },

};

export default Shortcuts;
