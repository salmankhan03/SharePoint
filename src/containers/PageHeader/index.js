import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

const PageHeaders = () => {
    const validateData = useSelector((state) => state.validateData);
    const [fontFamilys, setFontFamilys] = useState()
    const [fontColor, setFontColor] = useState()
    const pageHeaderStyle = {
        ...styles.pageHeader,
        backgroundColor: validateData?.siteStyle?.backgroundColor || styles.pageHeader.backgroundColor,
    };

    useEffect(() => {
        if (validateData?.siteStyle?.fontHeader) {
            const regex = /font-style:\s*([^;]*);?\s*font-color:\s*([^;]*)/;
            const matches = validateData?.siteStyle?.fontHeader?.match(regex);
            if (matches) {
                const fontFamily = matches[1].trim();
                const fontColor = matches[2].trim();

                if (fontFamily) {
                    setFontFamilys(fontFamily);
                }

                if (fontColor) {
                    setFontColor(fontColor);
                }
            }
        }
    }, [])

    return (
        <div style={pageHeaderStyle}>
            <div style={{ display: 'flex', justifyContent: "space-between", height: '100%', padding: '0px 15px' }}>
                <div style={{ color: '#fff', fontSize: '20px', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    <img
                        src={validateData?.logoUrl}
                        alt={"sitewise logo"}
                        width="150"
                    />
                    <div style={{
                        marginLeft: '25px',
                        marginTop: 8,
                        fontFamily: fontFamilys ? fontFamilys : '',
                        color: fontColor ? fontColor : 'white'
                    }}>{validateData?.title}</div>
                </div>
                <div style={{ display: 'flex' }}>

                </div>
            </div>
        </div>
    );
};

const styles = {
    pageHeader: {
        height: '70px',
        backgroundColor: '#021E4F'
    }
};

export default PageHeaders;