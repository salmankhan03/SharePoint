import React from "react";
import { Spin } from 'antd';

const Loading = () => {
    return (
        <div className="loading-page">
            <div style={styles.loading}>
                <div className="loadingLogo" >
                    <Spin size="large" />
                    {/* Remove  tip="Loading Site..." from the spin  */}
                </div>
                <div>
                    <div style={styles.loadingDesc}>Loading Site...</div>
                </div>
            </div>
        </div>
    );
};

const styles = {
    loading: { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' },
    loadingDesc: { color: '#333', fontWeight: 600, fontSize: 16, }
}

export default Loading;
