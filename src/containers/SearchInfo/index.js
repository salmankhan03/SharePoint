import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Button,
} from "antd";

import { Row, Col } from "antd";
import { Input as AntInput, Select } from 'antd';
import { CaretDownOutlined, CaretRightOutlined, DeleteOutlined, MapOutlined } from '@ant-design/icons';



import LeftDrawerContent from "../../components/LeftDrawerContent";
import Search from "../Search";
import { center, closeInfo, setSelectedMapHideShow } from "../../store";
import axios from 'axios';
import submitSuccess from '../../assets/images/submitSuccess.svg'
import optionalFieldDown from '../../assets/images/optionalFieldDown.svg'

import { message } from 'antd';
import Marker from "../../assets/icons/Marker"


const { Option } = Select;
const { TextArea } = AntInput;

const InputComp = (props) => {
    const { id, label, multiline, disabled, is_input_pw, showPassword, type, inputProps, value, onChange, placeholder, autoFocus, ...rest } = props;

    const handleChange = event => onChange(id, event.target.value)

    const inputRef = useRef(null);

    useEffect(() => {
        if (autoFocus && inputRef.current) {
            inputRef.current.focus();
            inputRef.current.select();
        }
    }, [autoFocus]);


    return (
        <div style={{ display: 'flex', flexDirection: "column" }}>
            <Col span={24} style={styles.inputLabel}>
                {label}
            </Col>
            <Col span={24} style={styles.inputs}>
                {type === "text" ? <AntInput
                    style={{ position: 'inherit' }}
                    ref={inputRef}
                    autoFocus={autoFocus}
                    // className={`${col_field} ${multiline ? 'input-multiline' : ''}`}
                    disabled={disabled}
                    placeholder={placeholder}
                    type={type}
                    value={value || ''}
                    onChange={handleChange}
                    {...rest}
                /> :
                    <TextArea
                        rows={4}
                        // maxLength={6}
                        style={{ position: 'inherit' }}
                        ref={inputRef}
                        autoFocus={autoFocus}
                        // className={`${col_field} ${multiline ? 'input-multiline' : ''}`}
                        disabled={disabled}
                        placeholder={placeholder}
                        type={type}
                        value={value || ''}
                        onChange={handleChange}
                        {...rest}
                    />
                }
            </Col>
        </div>
    );
};



const Layers = ({ width }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMapOptions, setSelectedMapOptions] = useState(false);

    const { locationDetail, viewSideDetailFields, position } = useSelector((state) => state);
    const validateData = useSelector((state) => state.validateData);

    const instructionParagraphs = validateData?.instructions?.replace(/<br\/>/g, '');
    const storedContactInfo = JSON.parse(localStorage.getItem('contactInfo')) || { name: '', email: '' };
    const [mapData, setMapData] = useState({ mapName: '', comments: '',name:'',email:'' });
    const [submitSuccessFull, SetSubmitSuccessFull] = useState(false)
    const [optionalField, SetOptionalField] = useState(false)

    useEffect(() => {
       setMapData((prevMapData) => ({
            ...prevMapData,
            mapName: locationDetail,
            name: storedContactInfo ? storedContactInfo.name :'',
            email:storedContactInfo ? storedContactInfo.email :'',
        }));
    }, [locationDetail])
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

    const handleSubmit = async (e) => {
        e.preventDefault()

        const payload = {
            accessKey: 'abc',
            comment: mapData.email,
            from: mapData.name,
            id: validateData.id,
            sites: [
                {
                    comment: mapData.comments,
                    site: { latitude: position.lat, longitude: position.lng },
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
            SetSubmitSuccessFull(true)
            localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
            message.success('Site Submitted successfully');
            onClose()
            setMapData({ mapName: '', comments: '' })
            // setCurrentStep(1)
        } catch (error) {
            message.error(error);
        }

    }

    const submitAnotherSite = () => {
        SetSubmitSuccessFull(false)
        setCurrentStep(1);
    }

    const handleChangeInput = (key, value) => {
        setMapData((prevRoles) => ({
            ...prevRoles,
            [key]: value,
        }));
    };

    const renderInput = (id, label, value, type, placeholder, autoFocus) => {
        return (
            <div style={styles.input} key={id}>
                <InputComp
                    id={id}
                    label={label}
                    value={value}
                    type={type}
                    onChange={handleChangeInput}
                    placeholder={placeholder}
                    autoFocus={autoFocus}
                />
            </div>
        );
    };

    const selectOptions = [
        { value: 'option1', label: 'Option 1' },
        { value: 'option2', label: 'Option 2' },
        { value: 'option3', label: 'Option 3' },
        // ... add more options as needed
    ];

    const handleChangeSelect = (key, value) => {
        setMapData((prevData) => ({
            ...prevData,
            [key]: value,
        }));
    };

    const renderSelect = (id, label, value, options, placeholder, autoFocus) => {
        return (
            <div style={styles.input} key={id}>
                <Col span={24} style={styles.inputLabel}>
                    {label}
                </Col>
                <Col span={24} style={styles.inputs}>
                    <Select
                        style={{ width: '100%' }}
                        value={value}
                        onChange={(newValue) => handleChangeSelect(id, newValue)}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                    >
                        {options.map((option) => (
                            <Option key={option.value} value={option.value}>
                                {option.label}
                            </Option>
                        ))}
                    </Select>
                </Col>
            </div>
        );
    };
    const dispatch = useDispatch();

    const onClose = useCallback(() => {
        dispatch(closeInfo());
    }, [dispatch]);
    const selectedOnTheMap = () => {
        setSelectedMapOptions(!selectedMapOptions)
        dispatch(setSelectedMapHideShow(!selectedMapOptions));
    };
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
      }

    return (
        <div style={styles.container}>
            {/* {saveModal}
      {layerGroup} */}
            <LeftDrawerContent title="Layers">
                <div style={styles.topBox}>
                    <div style={styles.containerDiv} className={'containerDiv'}>
                        {currentStep === 1 && submitSuccessFull === false &&
                            <>
                                <div style={{ color: '#021E4F', fontWeight: 700, fontSize: '14px', margin: '15px 2px' }}>{instructionParagraphs}</div>
                                <Search />
                                <div style={{ marginTop: 8, alignItems: 'flex-end', textAlign: 'right' }}>
                                    <div onClick={selectedOnTheMap} style={{ color: '#0087b7', fontSize: 14, cursor: 'pointer' }}>
                                        <Marker color="#0087b7" size="14" /> Select On the Map
                                    </div>
                                </div>

                                {viewSideDetailFields === true ? <div style={styles.mapDetailsContainer}>
                                    <Row>
                                        <Col span={22} style={styles.inputLabel}>{locationDetail}</Col>
                                        <Col span={2} style={{ display: 'flex', justifyContent: 'end', position: 'inherit' }}> <DeleteOutlined onClick={onClose} style={styles.inputLabel} /></Col>
                                    </Row>
                                    {renderInput('mapName', 'Name', mapData.mapName, 'text', 'Site Name', viewSideDetailFields)}
                                    {renderInput('comments', 'Comments', mapData.comments, 'text-area', 'Comments')}

                                    <div onClick={() => SetOptionalField(!optionalField)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                        {optionalField ? (
                                            <CaretDownOutlined style={{ marginTop: 8 }} />
                                        ) : (<CaretRightOutlined style={{ marginTop: 8 }} />)}
                                        <div style={{ fontWeight: 700, fontSize: 14, fontFamily: 'Roboto', color: '#021E4F', marginTop: 12 }}>Site Characteristics (Optional)</div>
                                    </div>

                                    {optionalField === true && <div>
                                        {renderSelect('parkingSpot', 'Parking Spots', mapData.parkingSpot, selectOptions, 'Parking Spots', false)}
                                        {renderSelect('vecantAnchors', 'Vacant Anchors/Big Box in Shopping Center?', mapData.vecantAnchors, selectOptions, 'Vacant Anchors/Big Box in Shopping Center?', false)}
                                        {renderSelect('venue', 'Venue Type', mapData.venue, selectOptions, 'Venue Type', false)}
                                        {renderSelect('locationType', 'Location Type', mapData.locationType, selectOptions, 'Location Type', false)}
                                        {renderSelect('driveThru', 'Drive-Thru?', mapData.driveThru, selectOptions, 'Drive-Thru?', false)}
                                        {renderSelect('gla', 'GLA (New Center)', mapData.gla, selectOptions, 'GLA (New Center)', false)}
                                    </div>}


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
                            currentStep === 2 && submitSuccessFull === false &&
                            <>
                                <div>
                                    <Row>
                                        <Col span={24} style={styles.mapDetailHeading}>Contact Information</Col>
                                    </Row>
                                    {renderInput('name', 'Name', mapData.name, 'text', 'Name')}
                                    {renderInput('email', 'Email Address', mapData.email, 'text', 'Email Address')}

                                </div>
                            </>
                        }


                        {submitSuccessFull === true && <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: 60 }}>
                                <img
                                    src={submitSuccess}
                                    alt={'submitSuccess'}
                                    // style={styles.iconSvg}
                                    width="64"
                                    height="64"
                                />
                                <div style={{ color: '#0087B7', marginTop: 9, fontSize: 14, fontWeight: 700, fontFamily: 'Poppins' }}>Thank you for submitting your site</div>
                                <Button onClick={submitAnotherSite} style={{ borderRadius: 4, border: '1px solid #0087B7', background: '#0087B7', fontWeight: 500, fontSize: 14, fontFamily: 'Roboto', color: '#FFF', marginTop: 24 }}>Submit Another Site</Button>
                            </div>
                        </div>}

                    </div>
                </div>


                {submitSuccessFull === false && <div style={styles.bottomBox}>
                    <div style={{ marginTop: '16px', width: '100%' }}>
                        <Row>
                            <Col span={18}>
                                {currentStep === 2 && (
                                    <Button style={{ marginLeft: '15px' }} onClick={handleBackStep}>Back</Button>
                                )}
                            </Col>
                            <Col span={6}>
                                <Button
                                    // style={styles.modalButton}
                                    type="primary"
                                    className={'sitewise-rect-primary-button'}
                                    onClick={currentStep === 1 ? moveNextStep : handleSubmit}
                                    disabled={
                                        (currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "" || mapData.comments === "")) ||
                                        (currentStep === 2 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                    }
                                >
                                    {currentStep === 1 ? 'Next' : 'Submit'}
                                </Button>
                            </Col>
                        </Row>


                    </div>
                </div>}
                {/*<LayersTree width={width} />*/}
            </LeftDrawerContent>
        </div>
    );
};

const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh" },
    topBox: { height: "calc(93vh - 70px)", backgroundColor: '#FAFAFC', overflow: 'auto' },
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

