import React from 'react';
import {useSelector} from "react-redux";
import logo from '../../assets/images/sitewise_logo.png'

const PageHeaders = () => {
    const validateData = useSelector((state) => state.validateData);
    return (
        <div style={styles.pageHeader}>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', height: '100%',padding: '0px 15px' }}>
                <div style={{color: '#fff', fontSize: '20px', fontWeight: 500, display: 'flex', alignItems: 'center' }}>
                    <img
                        src={logo}
                        alt={"sitewise logo"}
                        width="122"
                        height="27"
                    />
                    <div style={{marginLeft:'25px'}}>Site Submit to {validateData?.domainName}</div>
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