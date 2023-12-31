import React, {useEffect, useRef, useState} from "react";
import MapTypes from "../MapTypes";
import {useSelector} from "react-redux";

const Shortcuts = () => {
    const mapTypeId = useSelector((state) => state.mapTypeId);
    const [windowWidth, setWindowWidth] = useState(window.innerWidth);

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

    const dynamicStyle = {
        fontSize: 14,
        fontWeight: 500,
        fontFamily: 'Roboto',
        marginTop: 15,
        color: mapTypeId === 'roadmap' ? '#021E4F' : '#fff'
    };


    return (
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
                    alignItems: 'end'
                    // right: 15,
                }}
            >
                <div>
                    <MapTypes/>
                </div>
                <div style={dynamicStyle}>Powered By Sitewise</div>
            </div>
        </div>
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
};

export default Shortcuts;
