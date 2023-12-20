import React from 'react';
import { useSelector } from 'react-redux';
import { Dropdown, Menu, Spin, Typography } from 'antd';
import { Button } from "antd";

// import LightButton from './buttons/LightButton';
// import PrimaryButtons from './buttons/PrimaryButtons';
import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";

// import copy from '../helpers/copy';
// import { pewter } from '../util/colors';
import Icon from './Icon';
const pewter = '#cdd4e2';

const { Title } = Typography;

const  InfoCard = ({
    title,
    titleLoading,
    onClose,
    position,
    children,
                       visible
}) => {


    return (
        <>
            { <div className={'infoCard'}>
            <div
                style={{
                    ...styles.header
                }}
            >
                <div style={styles.headerTitle}>
                    <Title level={4} style={styles.title}>
                        {title}
                    </Title>
                    {titleLoading && (
                        <span style={styles.spin}>
                            <Spin size="small" />
                        </span>
                    )}
                </div>
                <div style={styles.cornerButtons}>

                    {onClose && (
                        <Button
                            type="link"
                            className="sitewise-light-button"
                            onClick={onClose}
                            style={styles.cornerButton}
                            disabled={false}
                        >
                            <CloseOutlined style={styles.font} />
                        </Button>
                    )}
                </div>
            </div>
            {children}
            {/*{buttons && <PrimaryButtons buttons={buttons} />}*/}
        </div>}
        </>
    );
};

const styles = {
    header: { display: 'flex', padding: '8px 8px 6px 16px' },
    headerTitle: { display: 'flex', width: 200 },
    title: { margin: 0, fontSize: 16, fontWeight: 'bold', lineHeight: '19px' },
    spin: { marginLeft: 8, position: 'relative', top: 2 },
    cornerButtons: { display: 'flex', justifyContent: 'flex-end', width: 80 },
    cornerButton: { width: 20, height: 20, marginLeft: 8, color: pewter },
    exportItem: { padding: '6px 8px', fontSize: 12 },
    exportFont: { fontSize: 16 },
    font: { fontSize: 14 }
};

export default InfoCard;


