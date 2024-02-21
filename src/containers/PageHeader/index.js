import React, { useEffect, useState } from 'react';
import { useSelector } from "react-redux";

const PageHeaders = () => {
    const validateData = useSelector((state) => state.validateData);
    const [fontFamilys, setFontFamilys] = useState()
    const [fontColor, setFontColor] = useState();
    const [backGroundColor, setBackGroundColor] = useState()

    useEffect(() => {
        if (validateData?.siteStyle) {
            const colorRegex = /color:\s*([^;]*)/;
            const styleRegex = /font-style:\s*([^;]*)/;
            const backgroundRegex = /background-color:\s*([^;]*)/; //Style
            const matches = validateData?.siteStyle?.fontHeader?.match(styleRegex);
            const matches1 = validateData?.siteStyle?.fontHeader?.match(colorRegex);
            const bGColorMatch = validateData?.siteStyle?.backgroundStyle?.match(backgroundRegex);
            if (matches) {
                const fontFamily = matches[1]?.trim();
                if (fontFamily) {
                    setFontFamilys(fontFamily);
                }
            }
            if (matches1) {
                const fontColor = matches1[1]?.trim();
                if (fontColor) {
                    setFontColor(fontColor);
                }
            }
            if (bGColorMatch) {
                const bgColor = bGColorMatch[1].trim();
                setBackGroundColor(bgColor)
            }
        }
    }, [validateData])

    return (
        <div style={{ ...styles.pageHeader, backgroundColor: backGroundColor ? backGroundColor : '#021E4F' }}>
            <div style={{ display: 'flex', justifyContent: "space-between", height: '100%', padding: '0px 15px' }}>
                <div style={{ color: '#fff', fontSize: '20px', fontWeight: 500, display: 'flex', alignItems: 'center', padding: '8px 0px' }}>
                    <img
                        src={validateData?.logoUrl}
                        alt={"sitewise logo"}
                        style={{ maxHeight: '-webkit-fill-available' }}
                    />
                    <div style={{
                        marginLeft: '25px',
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
    }
};

export default PageHeaders;