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
import { center, closeInfo, setSelectedMapHideShow, setContactScreenShowHide } from "../../store";
import axios from 'axios';
import submitSuccess from '../../assets/images/submitSuccess.svg'
import optionalFieldDown from '../../assets/images/optionalFieldDown.svg'
import { useDropzone } from 'react-dropzone';

import { message } from 'antd';
import Marker from "../../assets/icons/Marker"
import UploadIcon from "../../assets/icons/UploadIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
const { Option } = Select;
const { TextArea } = AntInput;

const InputComp = (props) => {
    const { id, label, multiline, disabled, is_input_pw, showPassword, type, inputProps, value, onChange, placeholder, autoFocus,fontStyle,fontColor, ...rest } = props;

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
            <Col 
                span={24} 
                style={{
                    ...styles.inputLabel,
                    fontFamily:fontStyle ? fontStyle:'', //+'!important'
                    color:fontColor? fontColor:'',
                }}
            >
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
    const addressDetails = useSelector((state) =>state.addressDetails);
    const validateData = useSelector((state) => state.validateData);
    const [fontFamilys, setFontFamilys] = useState()
    const [fontColor, setFontColor] = useState()
    const [hovered, setHovered] = useState(false);
    const [backHovered, setBackHovered] = useState(false);
    const [browsebtnHovered, setBrowsebtnHovered] = useState(false);
    const [successbtnHovered, setSuccessbtnHovered] = useState(false);
    const [btnBackgroundColor, setBtnBackgroundColor] = useState()
    const [btnFamily, setBtnFamily] = useState()
    const [btnHoverColor, setBtnHoverColor] = useState()
    const [btnHoverFamily, setBtnHoverFamily] = useState()

    const instructionParagraphs = validateData?.instructions?.replace(/<br\/>/g, '');
    const storedContactInfo = JSON.parse(localStorage.getItem('contactInfo')) || { name: '', email: '' };
    const [mapData, setMapData] = useState({ mapName: '', comments: '', name: '', email: '' });
    const [submitSuccessFull, SetSubmitSuccessFull] = useState(false)
    const [optionalField, SetOptionalField] = useState(true)
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [siteCharacteristics, SetSiteCharacteristics] = useState([])
    const [timeStamp, setTimeStamp] = useState(false)
    const timestampRef = useRef('');

    useEffect(() => {
        if (!timestampRef.current) {
            timestampRef.current = Date.now();
        } else{
            if(timeStamp === true){
                timestampRef.current = Date.now();
                setTimeStamp(false)
            }
        }
    }, [timeStamp]);



    useEffect(()=>{
        if(validateData?.siteStyle){
            const regex = /font-style:\s*([^;]*)/; //Style
            const regex1 = /font-color:\s*([^;]*)/; //font-color
            const buttonnRegex = /background-color:\s*([^;]*)/; //btn BGCOLOR
            const styleMatch = validateData?.siteStyle?.fontGeneral?.match(regex);         
            const fontColorMatch = validateData?.siteStyle?.fontGeneral?.match(regex1); 
            const btnBGColorMatch = validateData?.siteStyle?.buttonStyle?.match(buttonnRegex);  
            const btnFamilyMatch = validateData?.siteStyle?.buttonStyle?.match(regex);    
            const btnHoverMatch = validateData?.siteStyle?.buttonHover?.match(buttonnRegex);  
            const btnHoverFamilyMatch = validateData?.siteStyle?.buttonHover?.match(regex);  
            if (styleMatch) {
                const fontsFamily = styleMatch[1].trim();
                    setFontFamilys(fontsFamily) //General fonts Style
            }
            if(fontColorMatch){
                const fontscolor = fontColorMatch[1].trim();
                setFontColor(fontscolor) //General fonts color
            }
            if (btnBGColorMatch) {
                const backgroundColorValue = btnBGColorMatch[1].trim();
                setBtnBackgroundColor(backgroundColorValue) //General Btn BGColor
            }
            if (btnHoverMatch) {
                const hovberColorValue = btnHoverMatch[1].trim();
                setBtnHoverColor(hovberColorValue) //Btn Hover BGColor
            }
            if (btnHoverFamilyMatch) {
                const hovberFamilyValue = btnHoverFamilyMatch[1].trim();
                setBtnHoverFamily(hovberFamilyValue) //Btn Hover fonts Style
            }
            if (btnFamilyMatch) {
                const btnFamilyValue = btnFamilyMatch[1].trim();
                setBtnFamily(btnFamilyValue) //Btn fonts Style
            }
        }
    },[])
    useEffect(() => {
        for (let index = 0; index < validateData?.attributes.length; index++) {
            const element = validateData?.attributes[index];
            // if ((element?.tyo && element?.tyo.length > 0) ||
            //     element.columnName === "pco_address" || element.columnName === "pco_city" ||
            //     element.columnName === "pco_state" || element.columnName === "pco_zipcode") {
                if (element?.columnName !== "pco_name"){
                const transformedArray = element?.tyo?.filter(item => item !== "").map(item => {
                    const [value, option] = item.split('|');
                    return { value, option };
                });
                let obj = {
                    title: element.description,
                    options: transformedArray,
                    filedName: element.columnName,
                    columnType:element.columnType
                };
                SetSiteCharacteristics(prevState => [...prevState, obj]);
                setMapData((prevMapData) => ({
                    ...prevMapData,
                    [element?.columnName]: undefined,
                }));
            }
        }
        // }

    }, [validateData]);

    useEffect(() => {
        const data = locationDetail
        if (data) {
            const [nameAndCode, address, city, stateAndZipcode] = data?.split(", ");

            const { 1: name, 2: code } = nameAndCode?.match(/(.+) \((.+)\)/) || [];
            const { 1: state, 2: zipcode } = stateAndZipcode?.match(/([A-Z]+) (\d{5})/) || [];

            const result = {
                name: name || '',
                code: code || '',
                address: address || '',
                city: city || '',
                state: state || '',
                zipcode: zipcode || ''
            };

            setMapData((prevMapData) => ({
                ...prevMapData,
                mapName: locationDetail,
                name: storedContactInfo?.name || '',
                email: storedContactInfo?.email || '',
                // pco_name: addressDetails ? addressDetails?.formattedAddress : '',
                pco_address: addressDetails ? addressDetails?.formattedAddress   : '',
                pco_city: addressDetails ? addressDetails?.structuredAddress['locality,political'] :'',
                pco_state: addressDetails ? addressDetails?.structuredAddress['administrative_area_level_1,political'] :'',
                pco_zipcode: addressDetails ? addressDetails?.structuredAddress?.postal_code :''
            }));
        } else {
            setMapData((prevMapData) => ({
                ...prevMapData,
                mapName: locationDetail,
                name: storedContactInfo?.name || '',
                email: storedContactInfo?.email || '',
            }));
        }
    }, [locationDetail])
    const handleBackStep = () => {
        if (currentStep === 3 || currentStep === 2) {
            setCurrentStep(currentStep - 1);
            dispatch(setContactScreenShowHide(false))
        }
    };

    const moveNextStep = () => {
        if (currentStep === 1 || currentStep === 2) {
            setCurrentStep(currentStep + 1);
            dispatch(setContactScreenShowHide(true))
        }
    }
    function findResultValue(characteristic, key, siteCharacteristics, mapData) {
        const targetObject = siteCharacteristics?.find(({ filedName }) => filedName === key);
        const result = targetObject?.options?.find(({ value }) => value === mapData[characteristic?.filedName]);
        return result ? targetObject?.columnType === 1 ? JSON.parse(result?.value) : //Integer Value Pass
                        targetObject?.columnType === 0 ? result.option : //String Value Pass
                        targetObject?.columnType === 2 `${result.value}|${result.option}` //Float Value Pass
                        : undefined;
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        uploadfile()

        console.log("siteCharacteristics", siteCharacteristics)
        const characteristicValues = siteCharacteristics?.reduce((acc, characteristic) => {

            const key = characteristic.filedName;
            // const value = mapData[characteristic?.filedName];
            let value;
            switch (characteristic.filedName) {
                // case "pco_name":
                case "pco_address":
                case "pco_city":
                case "pco_state":
                case "pco_zipcode":
                case  "pco_exclude_sister":
                case  "pco_include_sister":
                    value = mapData[characteristic?.filedName];
                    break;
                default:
                    value = findResultValue(characteristic, key, siteCharacteristics, mapData);
                    break;
            }
            if (key !== undefined && value !== undefined) {
                acc[key] = value;
            }

            return acc;
        }, {});
        // console.log("characteristicValues",characteristicValues)
        let submitfiles = selectedFiles.map(file => `submitter/${timestampRef.current}/${file.path}`);
        const payload = {
            accessKey: 'abc',
            comment: mapData.email,
            from: mapData.name,
            id: validateData.id,
            sites: [
                {
                    site: { latitude: position.lat, longitude: position.lng },
                    name: mapData.mapName,
                    comment: mapData.comments,
                    attributes: {
                        ...characteristicValues
                    },
                    uploads: submitfiles
                }
            ]
        }

        const contactInfo = {
            name: mapData.name,
            email: mapData.email
        }

        console.log("PAY LOAD", payload)
        try {
            const response = await axios.post('https://submitapi.sitewise.com/submit', payload);
            console.log('API Response:', response);
            SetSubmitSuccessFull(true)
            localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
            message.success('Site Submitted successfully');
            onClose()
            setMapData({ mapName: '', comments: '' })
            setSelectedFiles([])
            setTimeStamp(true)
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
                    fontStyle={fontFamilys}
                    fontColor={fontColor}
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
                <Col span={24} style={{...styles.inputLabel,fontFamily:fontFamilys?fontFamilys:'',color:fontColor?fontColor:''}}>
                    {label}
                </Col>
                <Col span={24} style={styles.inputs}>
                    <Select
                        style={{ width: '100%',fontFamily:fontFamilys?fontFamilys:'' }}
                        value={value}
                        onChange={(newValue) => handleChangeSelect(id, newValue)}
                        placeholder={placeholder}
                        autoFocus={autoFocus}
                    >
                        {options?.map((option) => (
                            <Option key={option.value} value={option.value} style={{fontFamily:fontFamilys?fontFamilys:''}}>
                                {option.option}
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
        setSelectedMapOptions(true)
        dispatch(setSelectedMapHideShow(true));
    };
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    const onDrop = useCallback((acceptedFiles) => {
        const filesWithTimestamp = acceptedFiles.map(file => ({
            ...file,
            lastModified: file.lastModified,
            lastModifiedDate: file.lastModifiedDate,
            name: file.name,
            type: file.type,
            size: file.size,
            path: `submitter/${timestampRef.current}/${file.path}`
        }));

        setSelectedFiles((prevFiles) => [...prevFiles, ...filesWithTimestamp]);
    }, []);

    async function uploadfile() {
        try {
            const payload = selectedFiles.map(file => ({
                fileName: `${file.path}`,
                contentType: file.type
            }));

            const response = await axios.post('https://submitapi.sitewise.com/attach_urls', payload);

            const combinedData = response.data.map((url, index) => ({
                url,
                contentType: payload[index].contentType
            }));

            await uploadFilesToS3(combinedData)
        } catch (error) {
            message.error(error);
        }
    }

    const uploadFilesToS3 = async (data) => {
        try {

            await Promise.all(

                data.map(async (url) => {
                    const options = {
                        headers: {
                            'Content-Type': url.contentType
                        }
                    };

                    await axios.put(url.url, null, options);
                })
            );

            console.log('Files uploaded to S3 successfully');
        } catch (error) {
            console.error('Error uploading files to S3:', error);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        accept: ['image/jpeg', 'image/png', 'application/pdf', 'image/gif', 'image/svg+xml'],
        maxSize: 52428800,
        maxFiles: 5,
        onDrop,
    });
    const removeFile = (fileName) => {
        setSelectedFiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
    };

    const renderFiles = () => {
        return selectedFiles.map((file) => (
            <Row style={{ marginTop: 10 }}>
                <Col span={18}>
                    <div style={{...styles.fileListText,fontFamily:fontFamilys?fontFamilys:'',color:fontColor?fontColor:''}}>{file.name}</div>
                </Col>
                <Col span={6}>
                    <div style={styles.textEnd} onClick={() => removeFile(file.name)}>
                        <TrashIcon size="14" />
                    </div>
                </Col>
            </Row>
        ));
    };
    const handleMouseEnter = () => {
        setHovered(true);
    };
    const handleMouseLeave = () => {
        setHovered(false);
    };
    const handleBackMouseEnter = () => {
        setBackHovered(true);
    };
    const handleBackMouseLeave = () => {
        setBackHovered(false);
    };
    const handleBrowsekMouseEnter = () => {
        setBrowsebtnHovered(true);
    };
    const handleBrowseMouseLeave = () => {
        setBrowsebtnHovered(false);
    };
    const handleSuccesskMouseEnter = () => {
        setSuccessbtnHovered(true);
    };
    const handleSuccessMouseLeave = () => {
        setSuccessbtnHovered(false);
    };



    return (
        <div style={styles.container}>
            {/* {saveModal}
      {layerGroup} */}
            <LeftDrawerContent title="Layers">
                <div style={styles.topBox}>
                    <div style={styles.containerDiv} className={'containerDiv'}>
                        {currentStep === 1 && submitSuccessFull === false &&
                            <>
                                <div style={{ 
                                    fontFamily: fontFamilys ? fontFamilys :'',
                                    color : fontColor ? fontColor : '#021E4F',
                                    fontWeight: 700, 
                                    fontSize: '14px', 
                                    margin: '15px 2px' 
                                    }}>{instructionParagraphs}</div>
                                <Search />
                                <div style={{ marginTop: 8, alignItems: 'flex-end', textAlign: 'right' }}>
                                    <div 
                                        onClick={selectedOnTheMap} 
                                        style={{ 
                                            fontFamily: fontFamilys ? fontFamilys :'',
                                            color : fontColor ? fontColor : '#0087b7',
                                            fontSize: 14, cursor: 'pointer' }}>
                                            <Marker color={fontColor ? fontColor : '#0087b7'} size="14" /> Select On the Map
                                    </div>
                                </div>

                                {viewSideDetailFields === true ? <div style={styles.mapDetailsContainer}>
                                    <Row>
                                        <Col span={22} 
                                            style={{
                                                ...styles.inputLabel,
                                                fontFamily:fontFamilys? fontFamilys:'',
                                                color: fontColor ?  fontColor :'',
                                            }}
                                        >
                                            {locationDetail}
                                        </Col>
                                        <Col span={2} style={{ display: 'flex', justifyContent: 'end', position: 'inherit' }}> <DeleteOutlined onClick={onClose} style={styles.inputLabel} /></Col>
                                    </Row>
                                    {renderInput('mapName', 'Name', mapData.mapName, 'text', 'Site Name', viewSideDetailFields)}
                                    {renderInput('comments', 'Comments', mapData.comments, 'text-area', 'Comments')}

                                    <div onClick={() => SetOptionalField(!optionalField)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                        {optionalField ? (
                                            <CaretDownOutlined style={{ marginTop: 8 }} />
                                        ) : (<CaretRightOutlined style={{ marginTop: 8 }} />)}
                                        <div style={{ 
                                            fontWeight: 700, fontSize: 14,
                                            //  fontFamily: 'Roboto', 
                                            fontFamily: fontFamilys ? fontFamilys : 'Roboto' ,
                                            color:fontColor ? fontColor : '#021E4F', 
                                             marginTop: 12 }}>Site Characteristics (Optional)</div>
                                    </div>
                                    {optionalField === true && siteCharacteristics && (
                                        <div>
                                            {siteCharacteristics.map((characteristic, index) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        {characteristic?.options === undefined ? (
                                                            <>
                                                                <div style={styles.input} key={characteristic?.filedName}>
                                                                    <Col span={24} style={styles.inputs}>
                                                                        <InputComp
                                                                            id={characteristic?.filedName}
                                                                            label={characteristic?.title}
                                                                            value={mapData[characteristic?.filedName]}
                                                                            type="text"
                                                                            onChange={handleChangeInput}
                                                                            placeholder={characteristic?.title}
                                                                            autoFocus={false}
                                                                            fontStyle={fontFamilys}
                                                                            fontColor={fontColor}
                                                                            
                                                                        />
                                                                    </Col>
                                                                </div>
                                                            </>
                                                        ) : (
                                                            renderSelect(
                                                                characteristic?.filedName,         // Field Name
                                                                characteristic?.title,             // Label
                                                                mapData[characteristic?.filedName], // Value
                                                                characteristic?.options,           // Options
                                                                characteristic?.title,             // Placeholder
                                                                false,
                                                                

                                                            )
                                                        )}
                                                    </React.Fragment>
                                                );
                                            })}
                                        </div>
                                    )}



                                </div> :

                                    <div style={styles.noLocationContainer}>
                                        <div>
                                            <Row style={styles.noLocation}>
                                                <label style={{
                                                     fontFamily: fontFamilys ? fontFamilys :'',
                                                     color : fontColor ? fontColor : '',
                                                }}>No location to show yet</label>
                                            </Row>
                                            <Row style={{...styles.noLocationSearch,
                                               fontFamily: fontFamilys ? fontFamilys :'',
                                               color : fontColor ? fontColor : '',
                                            }}>
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
                                        <Col 
                                            span={24} 
                                            style={{
                                            ...styles.fileUploadHeading,
                                            fontFamily:fontFamilys? fontFamilys :'',
                                            color: fontColor ? fontColor: '', 
                                        }}
                                        >
                                            Attach Files (optional)
                                        </Col>
                                    </Row>
                                    <div style={styles.uploadContainer}>
                                        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                                            <input {...getInputProps()} />
                                            <p style={styles.textCenter}>  <UploadIcon color="#0087b7" size="14" /> </p>
                                            <p style={{
                                                ...styles.infoText,
                                                fontFamily:fontFamilys? fontFamilys:'',
                                                color:fontColor ? fontColor:'',
                                                }}>
                                                <i className="fas fa-cloud-upload-alt"></i> Drag and drop files here
                                            </p>
                                            <p style={{
                                                ...styles.infoText,
                                                fontFamily:fontFamilys? fontFamilys:'',
                                                color:fontColor ? fontColor:'',
                                                }}>or</p>
                                        </div>
                                        <Button
                                            // type="primary"
                                            onMouseEnter={handleBrowsekMouseEnter}
                                            onMouseLeave={handleBrowseMouseLeave}
                                            style={{
                                                ...styles.BrowseButton,
                                                fontFamily: btnFamily ? (browsebtnHovered ? btnHoverFamily : btnFamily) : '' ,
                                                backgroundColor: btnBackgroundColor ? (browsebtnHovered ? btnHoverColor : 'white') : (browsebtnHovered ? '#0087b7' : 'white') ,
                                                color: btnBackgroundColor ? (browsebtnHovered ? 'white': (btnBackgroundColor ? btnBackgroundColor : 'black')) : (browsebtnHovered ? 'white' : '#0087b7') ,
                                                borderColor:btnBackgroundColor ? (browsebtnHovered ? "white" : (btnBackgroundColor ? btnBackgroundColor : 'transparent')):(browsebtnHovered ? 'white' : '#0087b7'),
                                                border: btnBackgroundColor ?  '1px solid' +btnBackgroundColor:  '1px solid #0087b7',
                                                borderRadius:'6px' 
                                              }}
                                            onClick={() => document.querySelector('input[type="file"]').click()}>
                                            +  Browse Files
                                        </Button>
                                    </div>
                                    <div style={{ 
                                            marginTop: 7, 
                                            ...styles.fileFormatText,  
                                            fontFamily:fontFamilys? fontFamilys :'',
                                            color: fontColor ? fontColor: '',  }}>
                                        The following formats can be uploaded: .pdf, .gif, .jpg or .png
                                    </div>
                                    <div>
                                        {selectedFiles.length > 0 && (
                                            <div>
                                                {renderFiles()}
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </>
                        }
                        {
                            currentStep === 3 && submitSuccessFull === false &&
                            <>
                                <div>
                                    <Row>
                                        <Col span={24} style={{...styles.mapDetailHeading,
                                           fontFamily:fontFamilys? fontFamilys :'',
                                           color: fontColor ? fontColor: '',}}>Contact Information</Col>
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
                                <div style={{ 
                                     fontFamily:fontFamilys? fontFamilys :'Poppins',
                                     color: fontColor ? fontColor: '#0087B7',
                                     marginTop: 9, 
                                     fontSize: 14, 
                                     fontWeight: 700, 
                                    }}>Thank you for submitting your site</div>
                                <Button onClick={submitAnotherSite} 
                                 onMouseEnter={handleSuccesskMouseEnter}
                                 onMouseLeave={handleSuccessMouseLeave}
                                style={{ 

                                    fontFamily: btnFamily ? (successbtnHovered ? btnHoverFamily : btnFamily) : '' ,
                                    backgroundColor: btnBackgroundColor ? (successbtnHovered ? btnHoverColor : 'white') : (successbtnHovered ? '#0087b7' : 'white') ,
                                    color: btnBackgroundColor ? (successbtnHovered ? 'white': (btnBackgroundColor ? btnBackgroundColor : 'black')) : (successbtnHovered ? 'white' : '#0087b7') ,
                                    borderColor:btnBackgroundColor ? (successbtnHovered ? "white" : (btnBackgroundColor ? btnBackgroundColor : 'transparent')):(successbtnHovered ? 'white' : '#0087b7'),
                                    border: btnBackgroundColor ?  '1px solid' +btnBackgroundColor:  '1px solid #0087b7',
                                    borderRadius:'6px' ,
                                    // border: '1px solid #0087B7', 
                                    // background: '#0087B7', 
                                    fontWeight: 500, 
                                    fontSize: 14, 
                                    // fontFamily: 'Roboto', 
                                    // color: '#FFF', 
                                    marginTop: 24 }}>Submit Another Site</Button>
                            </div>
                        </div>}

                    </div>
                </div>


                {submitSuccessFull === false && <div style={styles.bottomBox}>
                    <div style={{ marginTop: '16px', width: '100%' }}>
                        <Row>
                            <Col span={18}>
                                {currentStep !== 1 && (
                                    <Button 
                                    onMouseEnter={handleBackMouseEnter}
                                    onMouseLeave={handleBackMouseLeave}
                                    style={{ marginLeft: '15px',
                                    fontFamily: btnFamily ? (backHovered ? btnHoverFamily : btnFamily) : '' ,
                                    backgroundColor: btnBackgroundColor ? (backHovered ? btnHoverColor : 'white') : (backHovered ? '#0087b7' : 'white') ,
                                    color: btnBackgroundColor ? (backHovered ? 'white': (btnBackgroundColor ? btnBackgroundColor : 'black')) : (backHovered ? 'white' : '#0087b7') ,
                                    borderColor:btnBackgroundColor ? (backHovered ? "white" : (btnBackgroundColor ? btnBackgroundColor : 'transparent')):(backHovered ? 'white' : '#0087b7'),
                                    border: btnBackgroundColor ?  '1px solid' +btnBackgroundColor:  '1px solid #0087b7',
                                    borderRadius:'6px' }} onClick={handleBackStep}>Back</Button>
                                )}
                            </Col>
                            <Col span={6}>
                                <Button
                                    // style={styles.modalButton}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    style={{
                                        // backgroundColor: btnBackgroundColor ? (hovered ? btnBackgroundColor : 'white') : (hovered ? '#0087b7' : 'white') ,
                                        fontFamily: btnFamily ? (hovered ? btnHoverFamily : btnFamily) : '' ,
                                        backgroundColor: btnBackgroundColor ? 
                                                ((currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "") ||
                                                currentStep === 3 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                                ? 'white'  : (hovered ? btnBackgroundColor : 'white')) : (hovered ? '#0087b7' : 'white'),
                                        color: btnBackgroundColor ?  ((currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "") ||
                                                currentStep === 3 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                                ? '#ccc' : (hovered ? 'white': (btnBackgroundColor ? btnBackgroundColor : 'black'))) : (hovered ? 'white' : '#0087b7') ,
                                        borderColor:btnBackgroundColor ?((currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "") ||
                                                currentStep === 3 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                                ? '#ccc' : (hovered ? "white" : (btnBackgroundColor ? btnBackgroundColor : 'transparent'))):(hovered ? 'white' : '#0087b7'),
                                        border: btnBackgroundColor ?  '1px solid' +btnBackgroundColor:  '1px solid #0087b7',
                                        borderRadius:'6px'
                
                                    }}
                                    onClick={currentStep === 1 || currentStep === 2 ? moveNextStep : handleSubmit}
                                    disabled={
                                        (currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "")) || // comments remove =>  || mapData.comments === ""
                                        (currentStep === 3 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                    }
                                    className={btnBackgroundColor ? "" :'sitewise-rect-primary-button'}

                                >
                                    {currentStep === 1 || currentStep === 2 ? 'Next' : 'Submit'}
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
    topBox: { height: "calc(100vh - 135px)", backgroundColor: '#FAFAFC', overflow: 'auto' },
    bottomBox: { height: "65px", borderTop: '1px solid #AEB9CA', backgroundColor: '#FFFFFF' },
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
    },
    uploadContainer: {
        border: '1px solid #AEB9CA ',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20,
        backgroundColor: '#fff',
        padding: 20
    },

    dropzone: {
        border: '2px dashed #cccccc',
        borderRadius: 4,
        padding: 20,
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'border 0.3s ease-in-out',
    },
    fileUploadHeading: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0em',
        textAlign: 'left'
    },
    fileFormatText: {
        fontFamily: 'Roboto',
        fontSize: 12,
        fontWeight: 400,
        lineHeight: '14px',
        letterSpacing: '0em',
        textAlign: 'left'
    },
    fileListText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0em',
        textAlign: 'left'
    },
    textCenter: {
        textAlign: 'center'
    },
    font13: {
        fontSize: 13
    },
    textEnd: {
        textAlign: 'end'
    },
    BrowseButton: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '24px',
        letterSpacing: '0em',
        textAlign: 'center',
        backgroundColor: '#0087b7'
    },
    infoText: {
        fontFamily: 'Roboto',
        fontSize: 14,
        fontWeight: 500,
        lineHeight: '16px',
        letterSpacing: '0em',
        textAlign: 'center',
        color: '#021E4F'

    }

};

export default Layers;

