import React from "react";
// import logo from "../assets/images/SW-logo_white.png";


const SessionInvalid = () => {
    return (
        <div style={styles.sessionTimeOut}>
            <div style={styles.session}>
                <div style={styles.loadingWebLogo}>
                    {/*<img*/}
                    {/*    src={logo}*/}
                    {/*    alt={"sitewise logo"}*/}
                    {/*    width="300"*/}
                    {/*/>*/}
                </div>
                <div style={styles.sessionHeader}>
                    The page cannot be displayed.
                </div>

                <div style={styles.sessionDesc}>
                    The page you are looking for is unavailable due to an expired session or other technical issues.<br />
                    Please contact the person who shared the map with you.
                </div>

            </div>
        </div>
    );
};

const styles = {
    sessionTimeOut: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100%',
        background: 'linear-gradient(202.32deg, rgb(3, 40, 105) 9.68%, rgba(2, 35, 92, 0.71) 61.13%, rgba(2, 30, 79, 0.45) 88.43%)',
        zIndex: 9999,
    },
    session: { textAlign: 'center' },
    sessionHeader: {
        fontFamily: 'Work Sans',
        fontSize: 28,
        fontStyle: 'normal',
        fontWeight: 700,
        lineHeight: 'normal',
        letterSpacing: '-0.68px',
        color: '#FFF',
        marginBottom: '30px'
    },
    sessionDesc: { fontWeight: 500, color: '#FFF', fontSize: 14, fontFamily: 'Roboto', lineHeight: 'normal' }
}


export default SessionInvalid;
