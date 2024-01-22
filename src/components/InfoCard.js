import React from 'react';
import { Spin, Typography } from 'antd';
import { Button } from "antd";
import CloseOutlined from "@ant-design/icons/lib/icons/CloseOutlined";

const pewter = '#cdd4e2';

const { Title } = Typography;

const InfoCard = ({
    title,
    titleLoading,
    onClose,
    position,
    children,
    visible
}) => {

    return (
        <>
            {<div className={'infoCard'}>
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
                                disabled={visible}
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
    header: { display: 'flex', padding: '10px 16px 10px 16px', alignItems: 'baseLine' },
    headerTitle: { display: 'flex', width: 200 },
    title: { margin: 0, fontSize: 16, fontWeight: 'bold', lineHeight: '19px', color: '#021e4f' },
    spin: { marginLeft: 8, position: 'relative', top: 2 },
    cornerButtons: { display: 'flex', justifyContent: 'flex-end', width: 80 },
    cornerButton: { width: 20, height: 20, marginLeft: 8, color: pewter },
    exportItem: { padding: '6px 8px', fontSize: 12 },
    exportFont: { fontSize: 16 },
    font: { fontSize: 14 }
};

export default InfoCard;


