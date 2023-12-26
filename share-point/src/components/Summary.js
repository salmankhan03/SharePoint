import React from 'react';
import { List, Col, Tooltip } from 'antd';

import Skeleton from './Skeleton';

const snow = '#F4F6FC';

const isValidURL = str => {
    const pattern = new RegExp(
        '^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$',
        'i'
    ); // fragment locator
    return !!pattern.test(str);
}; //https://stackoverflow.com/questions/5717093/check-if-a-javascript-string-is-a-url

const Value = ({ value }) => {
    if (isValidURL(value)) {
        return (
            <a href={value} target="_blank" rel="noopener noreferrer">
                {value}
            </a>
        );
    }
    return <span>{value}</span>;
};

const Summary = ({ loading, dataSource, style = styles.container, children, rightAlign }) => {
    return (
        <>
            {dataSource !== null && <div style={style} className="sitewise-skeleton-summary">
                {children || ''}
                <List className={'summeryTitle'} style={styles.summeryTitle}> Details from Google Maps </List>
                <List className={'summeryList'} style={styles.summeryList}> {dataSource} </List>
                <List className={'summeryLink'} style={styles.summeryLink}> View in Google Maps </List>
            </div>}
        </>

    )

};

const styles = {
    container: { padding: '0 8px', backgroundColor: '#F4F6FC', margin: '8px 10px 10px 10px', borderRadius: '4px' },
    item: {
        minHeight: 22,
        fontSize: 12,
        padding: '4px 8px',
        border: 'none',
        lineHeight: '16px'
    },
    label: { fontWeight: 'bold', width: 138, paddingRight: 24 },
    value: { overflow: 'hidden', textOverflow: 'ellipsis', width: 108 },
    summeryTitle: {
        fontFamily: 'Poppins',
        fontSize: '14px',
        fontWeight: 'bold',
        lineHeight: '22px',
        color: 'rgb(2, 30, 79)'
    },
    summeryList: {
        fontFamily: 'Poppins',
        fontSize: '14px',
        fontWeight: '600',
        lineHeight: '22px',
        color: 'rgb(2, 30, 79)'
    },
    summeryLink: {
        fontFamily: 'Poppins',
        fontSize: '14px',
        fontWeight: '400',
        lineHeight: '22px',
        color: '#0087b7'
    }
};

export default Summary;
