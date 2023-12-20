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
    const { id, label, multiline, disabled, is_input_pw, showPassword, type, inputProps, value, onChange, ...rest } = props;

    // const class_wr = 'your-class-wr'; // replace with your class name
    // const col_label = 'your-col-label'; // replace with your class name
    // const col_field = 'your-col-field'; // replace with your class name

    const handleChange = event => onChange(id, event.target.value)

    return (
        <div style={{display: 'flex', flexDirection: "column"}}>
            <Col span={24}>
                {label}
            </Col>
            <Col span={24}>
                <AntInput
                    style={styles.input}
                    // className={`${col_field} ${multiline ? 'input-multiline' : ''}`}
                    disabled={disabled}
                    type={is_input_pw && showPassword ? 'text' : type}
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

    const renderInput = (id, label, value, type = 'text') => {
        return (
            <div className="" key={id}>
                <InputComp
                    id={id}
                    label={label}
                    value={value}
                    type={type}
                    onChange={handleChangeInput}
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

                    {currentStep === 1 &&
                        <>
                            <Search/>
                            <div>
                                <Row>
                                    <Col span={22}>{locationDetail}</Col>
                                    <Col span={2}> <DeleteOutlined style={{ fontSize: '16px'}} /></Col>
                                </Row>

                                <Row>
                                    {renderInput('mapName', 'Name', mapData.mapName, 'text' )}
                                </Row>
                                <Row>
                                    {renderInput('comments', 'Comments', mapData.comments, 'text' )}
                                </Row>
                            </div>
                        </>
                    }

                    {
                        currentStep === 2 &&
                        <>
                            <div>
                                <Row>
                                    <Col span={24}>Contact Information</Col>
                                </Row>

                                <Row>
                                    {renderInput('name', 'Name', mapData.name, 'text' )}
                                </Row>
                                <Row>
                                    {renderInput('email', 'Email Address', mapData.email, 'text' )}
                                </Row>
                            </div>
                        </>
                    }


                </div>


                <div style={styles.bottomBox}>
                    <div style={{ marginTop: '16px' }}>
                        {currentStep === 2 && (
                            <Button  onClick={handleBackStep}>Back</Button>
                        )}
                        <Button
                            // style={styles.modalButton}
                            type="primary"
                            onClick={currentStep === 1 ? moveNextStep : handleSubmit}
                            // disabled={(jsonText !== null && jsonError !== 'Invalid JSON data') ? false : true}
                        >
                            {currentStep === 1 ? 'Next' : 'Submit'}
                        </Button>
                    </div>
                </div>
                {/*<LayersTree width={width} />*/}
            </LeftDrawerContent>
        </div>
    );
};

const styles = {
    container: { display: "flex", flexDirection: "column", height: "100vh" },
    topBox: { height: "90vh" },
    bottomBox: { height: "10vh" },
    input: {}
};

export default Layers;

