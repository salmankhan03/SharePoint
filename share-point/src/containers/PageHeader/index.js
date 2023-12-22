import React from 'react';

const PageHeaders = () => {
    return (
        <div style={styles.pageHeader}>
            <div style={{ display: 'flex', justifyContent: "space-between", alignItems: 'center', height: '100%',padding: '0 35px' }}>
                <div style={{color: 'fff'}}>
                    Logo
                </div>
                <div style={{color: 'fff'}}>
                    Client Logo
                </div>
            </div>
        </div>
    );
};

const styles = {
    pageHeader: {
        height: '70px',
        backgroundColor: 'blue'
    }
};

export default PageHeaders;