import React, {useEffect, useRef, useState} from "react";
import MapTypes from "../MapTypes";

const Shortcuts = () => {

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
                    // right: 15,
                }}
            >
                <div style={styles.siteLogo}>
                    <MapTypes/>
                </div>
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
};

export default Shortcuts;
