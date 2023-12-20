import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Checkbox,
    Menu,
    Radio,
    Typography,
    Modal,
    Button,
    Switch,
    Tabs,
} from "antd";

// import {
//     SearchOutlined,
//     PlusOutlined,
//     FileOutlined,
//     EllipsisOutlined,
// } from "@ant-design/icons";
// import Layer from "../../assets/icons/Layer";
import { Row, Col } from "antd";
import { Input as AntInput } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

import _ from "lodash";
// import uuid from 'uuid';
import LeftDrawerContent from "../../components/LeftDrawerContent";
import Search from "../Search";
// import Icon from "../../components/Icon";
// import InputBox from "../../components/InputBox";
// import Details from "../Details";
// import LayersTree from "./LayersTree";



const InputComp = (props) => {
    const { id, label, multiline, disabled, is_input_pw, showPassword, type, inputProps, value, onChange, placeholder, ...rest } = props;

    // const class_wr = 'your-class-wr'; // replace with your class name
    // const col_label = 'your-col-label'; // replace with your class name
    // const col_field = 'your-col-field'; // replace with your class name

    const handleChange = event => onChange(id, event.target.value)

    return (
        <div style={{display: 'flex', flexDirection: "column"}}>
            <Col span={24} style={styles.inputLabel}>
                {label}
            </Col>
            <Col span={24}>
                <AntInput
                    style={styles.inputs}
                    // className={`${col_field} ${multiline ? 'input-multiline' : ''}`}
                    disabled={disabled}
                    placeholder={placeholder}
                    type={type}
                    value={value || ''}
                    onChange={handleChange}
                    {...rest}
                />
            </Col>
        </div>
    );
};



const Layers = ({ width }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const { locationDetail } = useSelector((state) => state);
    const [mapData, setMapData] = useState({});

    const handleBackStep = () => {
        if (currentStep === 2) {
            setCurrentStep(1);
        }
    };

    const moveNextStep = () => {
        if (currentStep === 1) {
            setCurrentStep(2);
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        console.log('submit data')
    }

    const handleChangeInput = (key, value) => {
        setMapData((prevRoles) => ({
            ...prevRoles,
            [key]: value,
        }));
    };

    const renderInput = (id, label, value, type = 'text', placeholder) => {
        return (
            <div style={styles.input} key={id}>
                <InputComp
                    id={id}
                    label={label}
                    value={value}
                    type={type}
                    onChange={handleChangeInput}
                    placeholder={placeholder}
                />
            </div>
        );
    };

    console.log('map---------------------------', mapData)

    return (
        <div style={styles.container}>
            {/* {saveModal}
      {layerGroup} */}
            <LeftDrawerContent title="Layers">
                <div style={styles.topBox}>
                    <div style={styles.containerDiv} className={'containerDiv'}>
                        {currentStep === 1 &&
                        <>
                            <Search/>
                            <div style={styles.mapDetailsContainer}>
                                <Row>
                                    <Col span={22} style={styles.inputLabel}>{locationDetail}</Col>
                                    <Col span={2}> <DeleteOutlined style={styles.inputLabel} /></Col>
                                </Row>
                                {renderInput('mapName', 'Name', mapData.mapName, 'text', 'Site Name' )}
                                {renderInput('comments', 'Comments', mapData.comments, 'text', 'Comments' )}

                            </div>
                        </>
                        }

                        {
                            currentStep === 2 &&
                            <>
                                <div>
                                    <Row>
                                        <Col span={24} style={styles.mapDetailHeading}>Contact Information</Col>
                                    </Row>
                                    {renderInput('name', 'Name', mapData.name, 'text', 'Name' )}
                                    {renderInput('email', 'Email Address', mapData.email, 'text', 'Email Address' )}

                                </div>
                            </>
                        }

                    </div>
                </div>


                <div style={styles.bottomBox}>
                    <div style={{ marginTop: '16px', width: '100%' }}>
                        <Row>
                            <Col span={18}>
                                {currentStep === 2 && (
                                    <Button style={{marginLeft: '15px'}}  onClick={handleBackStep}>Back</Button>
                                )}
                            </Col>
                            <Col span={6}>
                                <Button
                                    // style={styles.modalButton}
                                    type="primary"
                                    className={'sitewise-rect-primary-button'}
                                    onClick={currentStep === 1 ? moveNextStep : handleSubmit}
                                    // disabled={(jsonText !== null && jsonError !== 'Invalid JSON data') ? false : true}
                                >
                                    {currentStep === 1 ? 'Next' : 'Submit'}
                                </Button>
                            </Col>
                        </Row>


                    </div>
                </div>
                {/*<LayersTree width={width} />*/}
            </LeftDrawerContent>
        </div>
    );
};

const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh" },
    topBox: { height: "93vh" },
    bottomBox: { height: "7vh" },
    containerDiv: { padding: '15px' },
    mapDetailsContainer: {
        padding: '15px',
        border: '1px solid #AEB9CA',
        borderRadius: '5px',
        margin: '10px 0'
    },
    input: {
        margin: '8px 0'
    },
    inputLabel: {
        color: '#021E4F',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '4px',
    },
    mapDetailHeading: {
        fontFamily: 'Poppins',
        fontSize: '16px',
        fontWeight: 'bold',
        lineHeight: '22px',
        color: 'rgb(2, 30, 79)'
    }
};

export default Layers;

