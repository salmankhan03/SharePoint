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
console.log('dataSource--------------', dataSource)
    return (
        <div style={style} className="sitewise-skeleton-summary">
            {children || ''}
            <List> Details from Google Maps </List>
            <List> {dataSource} </List>
            <List> View in Google Maps </List>
        </div>

    )
    // if (dataSource.length > 0) {
    //     return (
    //         <div style={style} className="sitewise-skeleton-summary">
    //             {children || ''}
    //             <List
    //                 // dataSource={'welcome'}
    //                 // renderItem={(item, i) => {
    //                 //     const { label, value, tooltip } = item;
    //                 //     const color = i % 2 === 0 ? snow : 'white';
    //                 //     const left = tooltip ? (
    //                 //         <Col span={rightAlign ? 20 : 12} style={styles.label}>
    //                 //             <Tooltip title={tooltip}>{label}</Tooltip>
    //                 //         </Col>
    //                 //     ) : (
    //                 //         <Col span={rightAlign ? 20 : 12} style={styles.label}>
    //                 //             {label}
    //                 //         </Col>
    //                 //     );
    //                 //     return (
    //                 //         <Skeleton loading={loading}>
    //                 //             <List.Item style={{ ...styles.item, backgroundColor: color }}>
    //                 //                 {left}
    //                 //                 <Col
    //                 //                     span={rightAlign ? 4 : 12}
    //                 //                     style={{
    //                 //                         ...styles.value,
    //                 //                         ...(rightAlign ? { textAlign: 'right' } : {})
    //                 //                     }}
    //                 //                 >
    //                 //                     <Value value={value} />
    //                 //                 </Col>
    //                 //             </List.Item>
    //                 //         </Skeleton>
    //                 //     );
    //                 // }}
    //             >
    //                 {dataSource}
    //                 {/*<Col span={rightAlign ? 20 : 12} style={styles.label}>*/}
    //                 {/*               'hiiiii'*/}
    //                 {/*            </Col>*/}
    //             </List>
    //         </div>
    //     );
    // }
    // return false;
};

const styles = {
    container: { padding: '0 8px', backgroundColor: '#F4F6FC', margin: '8px 0' },
    item: {
        minHeight: 22,
        fontSize: 12,
        padding: '4px 8px',
        border: 'none',
        lineHeight: '16px'
    },
    label: { fontWeight: 'bold', width: 138, paddingRight: 24 },
    value: { overflow: 'hidden', textOverflow: 'ellipsis', width: 108 }
};

export default Summary;
