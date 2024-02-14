import React from "react";
import { Spin } from 'antd';
import logo from "../assets/images/sitewise_logo.png";

const Loading = () => {
    return (
        <div className="loading-page">
            <div style={styles.loading}>
                <div style={styles.loadingWebLogo}>
                    <img
                       src={logo}
                        alt={"sitewise logo"}
                        width="122"
                        height="27"
                    />
                </div>
                <div className="loadingLogo">
                    <Spin size="large" tip="Loading Shared Map..." />
                </div>
                <div>
                    <div style={styles.loadingDesc}>Loading Site Submit...</div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    loading: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    loadingDesc: { color: '#fff', fontWeight: 600, fontSize: 16, }
}

export default Loading;
