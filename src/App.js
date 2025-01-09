import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Provider } from "react-redux";
import Dashboard from "./containers/Dashboard";
import "./App.css";

import store, { setCurrentUserLocation, validateData } from "./store";
import Loading from "./components/Loading";
import SessionInvalid from "./components/SessionInvalid";

const App = () => {
    const dispatch = useDispatch();
    const [isValidSession, setIsValidSession] = useState(true);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        async function verifySession() {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const siteURL = urlParams.get('siteURL');
                const ApiDomain = siteURL ? new URL(siteURL).hostname : 'https://sites.sitewise.com';
                const sessionToken = urlParams.get("accessKey");
                setLoading(true);

                const domainName = urlParams.get('domain')

                if (domainName === null) {
                    // get the url
                    domainName = window.location.href;
                }

                const payload = {
                    accessKey: sessionToken ?? "",
                    domainName: domainName
                };

                const response = await fetch(`${ApiDomain}/api/validate`, {
                    method: 'POST',
                    body: JSON.stringify(payload)
                    }
                );
    const data = await response.json()
    if (data) {
        dispatch(validateData(data));
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const center = {
                        lat: latitude,
                        lng: longitude - 0.001,
                    };
                    const zoom = 15
                    dispatch(setCurrentUserLocation({ center, zoom }));
                    setLoading(false);
                },
                (error) => {
                    const center = { lat: 40.117546, lng: -107.20 };
                    const zoom = 5;
                    dispatch(setCurrentUserLocation({ center, zoom }));
                    setLoading(false);
                    // console.error("Error getting current location:", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    } else {
        setIsValidSession(false);
        console.error(
            `Failed to verify session. Status code: ${response.status}`
        );
    }
} catch (error) {
    setIsValidSession(false);
    console.error("Error while verifying session:", error);
}
        }

verifySession();
    }, [dispatch]);

if (isValidSession === false) {
    return (
        <div>
            <SessionInvalid />
        </div>
    );
}

if (loading) {
    return (
        <div>
            <Loading />
        </div>
    );
}

return (
    <div style={styles.fullscreen}>
        <Dashboard />
    </div>
);
};

const styles = {
    fullscreen: {
        height: "100vh",
        maxHeight: "-webkit-fill-available",
        // background:
        //     "linear-gradient(202.32deg, #032869 9.68%, rgba(2, 35, 92, 0.71) 61.13%, rgba(2, 30, 79, 0.45) 88.43%)",
    },
};

export default App;
