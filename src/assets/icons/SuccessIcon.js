import React from 'react';

const SuccessIcon = ({ color, size }) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="65" height="64" viewBox="0 0 65 64" fill="none">
        <circle cx="32.5" cy="32" r="30.5" stroke={color ? color : "#0087B7"} stroke-width="3" />
        <path d="M27.0332 36.9414L19.5297 31.1286L16.9746 33.7565L27.0332 44.1752L48.6043 22.365L46.8725 19.8254L27.0332 36.9414Z" fill={color ? color : "#0087B7"}  />
    </svg>
);

export default SuccessIcon;
