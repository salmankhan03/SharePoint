import React from 'react';
import { PageHeader } from 'antd';
// import YourLogo from './YourLogoComponent'; // Import your logo component

const PageHeaders = () => {
    const headerTitle = 'Your Page Title';

    return (
        <div>
            <PageHeader
                title={headerTitle}
                extra={[
                    'abc', // Place your logo component here
                ]}
            />
            {/* Your component content goes here */}
        </div>
    );
};

export default PageHeaders;