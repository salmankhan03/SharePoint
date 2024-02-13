import React from 'react';
import {useSelector} from "react-redux";

const PageHeaders = () => {
    const validateData = useSelector((state) => state.validateData);
    const pageHeaderStyle = {
        ...styles.pageHeader,
        backgroundColor: validateData?.siteStyle?.backgroundColor || styles.pageHeader.backgroundColor,
    };


    return (
        <div style={pageHeaderStyle}>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', height: '100%',padding: '0px 15px' }}>
                <div style={{color: '#fff', fontSize: '20px', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    <img
                        src={validateData?.logoUrl}
                        alt={"sitewise logo"}
                        width="150"
                    />
                    <div style={{marginLeft:'25px'}}>Site Submit to {validateData?.title}</div>
                </div>
                <div style={{display: 'flex'}}>

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