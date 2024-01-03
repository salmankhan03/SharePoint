import React from 'react';
import {useSelector} from "react-redux";
import logo from '../../assets/images/SW-logo_white.png'

const PageHeaders = () => {
    const validateData = useSelector((state) => state.validateData);
    return (
        <div style={styles.pageHeader}>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', height: '100%',padding: '0 35px' }}>
                <div style={{color: '#fff', fontSize: '25px', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    <img
                        src={logo}
                        alt={"sitewise logo"}
                        width="210"
                    />
                    <div>{validateData?.domainName}</div>
                </div>
                <div style={{display: 'flex'}}>
                    <img
                        src={validateData?.logoUrl}
                        alt={"sitewise logo"}
                        width="150"
                    />
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