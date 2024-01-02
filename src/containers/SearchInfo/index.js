import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Button,
} from "antd";

import { Row, Col } from "antd";
import { Input as AntInput } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';


import LeftDrawerContent from "../../components/LeftDrawerContent";
import Search from "../Search";
import {closeInfo} from "../../store";
import axios from 'axios';

import { message } from 'antd';



const InputComp = (props) => {
    const { id, label, multiline, disabled, is_input_pw, showPassword, type, inputProps, value, onChange, placeholder, ...rest } = props;

    const handleChange = event => onChange(id, event.target.value)

    return (
        <div style={{display: 'flex', flexDirection: "column"}}>
            <Col span={24} style={styles.inputLabel}>
                {label}
            </Col>
            <Col span={24} style={styles.inputs}>
                <AntInput
                    style={{position: 'inherit'}}
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
    const { locationDetail, viewSideDetailFields, position } = useSelector((state) => state);
    const validateData = useSelector((state) => state.validateData);

    const instructionParagraphs = validateData?.instructions?.replace(/<br\/>/g, '');

    const [mapData, setMapData] = useState({mapName: '', comments: ''});

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

    const handleSubmit = async(e) => {
        e.preventDefault()

        const payload = {
            accessKey: 'abc',
            comment: mapData.email,
            from: mapData.name,
            id: validateData.id,
            sites: [
                {
                    comment: mapData.comments,
                    site: { latitude: position.lat , longitude: position.lng },
                    attributes: {
                        test: mapData.mapName,
                    },
                }
            ]
        }

        const contactInfo = {
            name: mapData.name,
            email: mapData.email
        }

            try {
                const response = await axios.post('https://submitapi.sitewise.com/submit', payload);
                console.log('API Response:', response);
                localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
                message.success('Site Submitted successfully');
                onClose()
                setMapData({mapName: '', comments: ''})
                setCurrentStep(1)
            } catch (error) {
                message.error(error);
            }

    }

    const handleChangeInput = (key, value) => {
        setMapData((prevRoles) => ({
            ...prevRoles,
            [key]: value,
        }));
    };

    const renderInput = (id, label, value, type, placeholder) => {
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
    const dispatch = useDispatch();

    const onClose = useCallback(() => {
        dispatch(closeInfo());
    }, [dispatch]);

    return (
        <div style={styles.container}>
            {/* {saveModal}
      {layerGroup} */}
            <LeftDrawerContent title="Layers">
                <div style={styles.topBox}>
                    <div style={styles.containerDiv} className={'containerDiv'}>
                        {currentStep === 1 &&
                        <>
                            <div style={{color: '#021E4F', fontWeight: 700, fontSize: '14px', margin: '15px 2px'}}>{instructionParagraphs}</div>
                            <Search/>
                            {viewSideDetailFields === true ? <div style={styles.mapDetailsContainer}>
                                <Row>
                                    <Col span={22} style={styles.inputLabel}>{locationDetail}</Col>
                                    <Col span={2} style={{display: 'flex', justifyContent: 'end', position: 'inherit'}}> <DeleteOutlined onClick={onClose} style={styles.inputLabel} /></Col>
                                </Row>
                                {renderInput('mapName', 'Name', mapData.mapName, 'text', 'Site Name' )}
                                {renderInput('comments', 'Comments', mapData.comments, 'text', 'Comments' )}

                            </div> :

                                <div style={styles.noLocationContainer}>
                                    <div>
                                        <Row style={styles.noLocation}>
                                            <label>No location to show yet</label>
                                        </Row>
                                        <Row style={styles.noLocationSearch}>
                                            <label>please search</label>
                                        </Row>
                                    </div>
                                </div>
                            }
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
                                    disabled={(viewSideDetailFields === true && mapData.mapName !== "" && mapData.comments !== "") ? false : true}
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
    topBox: { height: "calc(93vh - 70px)", backgroundColor: '#FAFAFC' },
    bottomBox: { height: "7vh", borderTop: '1px solid #AEB9CA', backgroundColor: '#FFFFFF' },
    containerDiv: { padding: '15px' },
    mapDetailsContainer: {
        padding: '15px',
        border: '1px solid #AEB9CA',
        borderRadius: '5px',
        margin: '10px 0',
        backgroundColor: '#FFFFFF',

    },
    input: {
        margin: '8px 0'
    },
    inputLabel: {
        color: '#021E4F',
        fontSize: '14px',
        fontWeight: 500,
        marginBottom: '4px',
        position: 'inherit'
    },
    mapDetailHeading: {
        fontFamily: 'Poppins',
        fontSize: '16px',
        fontWeight: 'bold',
        lineHeight: '22px',
        color: 'rgb(2, 30, 79)'
    },
    noLocationContainer: {
        margin: '20px 1px 0px',
        border: '1px solid #AEB9CA',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'center',
        padding: '35px',
        backgroundColor: '#FFFFFF'
    },
    noLocationSearch: {
        display: 'flex',
        justifyContent: 'center',
        color: '#AEB9CA'
    },
    noLocation: {
        textAlign: 'center',
        color: '#AEB9CA'
    },
    inputs: {
        position: 'inherit'
    }
};

export default Layers;

