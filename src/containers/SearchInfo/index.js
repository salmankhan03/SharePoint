import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
    Button,
} from "antd";

import { Row, Col } from "antd";
import { Input as AntInput, Select, Checkbox } from 'antd';
import { CaretDownOutlined, CaretRightOutlined, DeleteOutlined, MapOutlined, DownOutlined, CaretUpOutlined, UpOutlined } from '@ant-design/icons';

import LeftDrawerContent from "../../components/LeftDrawerContent";
import Search from "../Search";
import {
    center,
    closeInfo,
    setSelectedMapHideShow,
    setContactScreenShowHide,
    setAttributesData
} from "../../store";
import axios from 'axios';
import submitSuccess from '../../assets/images/submitSuccess.svg'
import optionalFieldDown from '../../assets/images/optionalFieldDown.svg'
import { useDropzone } from 'react-dropzone';

import { message } from 'antd';
import Marker from "../../assets/icons/Marker"
import UploadIcon from "../../assets/icons/UploadIcon";
import SuccessIcon from "../../assets/icons/SuccessIcon";
import TrashIcon from "../../assets/icons/TrashIcon";
const { Option } = Select;
const { TextArea } = AntInput;

const InputComp = (props) => {
    const { id, label, multiline, disabled, is_input_pw, showPassword, type, inputProps, value, onChange, placeholder, autoFocus, fontStyle, fontColor, hoverBG, ...rest } = props;
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
                    fontFamily: fontStyle ? fontStyle : '', //+'!important'
                    color: fontColor ? fontColor : '#021e4f',
                }}
            >
                {label}
            </Col>
            <Col span={24} style={styles.inputs}>
                {type === "text" || type === "number" ? <AntInput
                    style={{ position: 'inherit' }}
                    ref={inputRef}
                    autoFocus={autoFocus}
                    // className={`${col_field} ${multiline ? 'input-multiline' : ''}`}
                    disabled={disabled}
                    placeholder={placeholder}
                    type={type}
                    value={value || ''}
                    onChange={handleChange}
                    className={'searchInfoInput'}
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
                        className={'searchInfoInput'}
                        {...rest}
                    />
                }
            </Col>
            <style>
                {`
                    .searchInfoInput:focus {
                        border-color: ${hoverBG ? hoverBG : '#0087b7'};
                        box-shadow: inset 0 0 0 1px ${hoverBG ? hoverBG : '#0087b7'};
                    }
                    
                    .searchInfoInput:hover {
                        border-color: ${hoverBG ? hoverBG : '#0087b7'};
                        box-shadow: inset 0 0 0 1px ${hoverBG ? hoverBG : '#0087b7'};
                     }
                `}
            </style>
        </div>
    );
};



const Layers = ({ width }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [selectedMapOptions, setSelectedMapOptions] = useState(false);

    const { locationDetail, viewSideDetailFields, position } = useSelector((state) => state);
    const addressDetails = useSelector((state) => state.addressDetails);
    const locationName = useSelector((state) => state.locationName);
    const validateData = useSelector((state) => state.validateData);
    const attributeData = useSelector((state) => state.attributeData);
    const [fontFamilys, setFontFamilys] = useState()
    const [fontColor, setFontColor] = useState()
    const [hovered, setHovered] = useState(false);
    const [backHovered, setBackHovered] = useState(false);
    const [browsebtnHovered, setBrowsebtnHovered] = useState(false);
    const [successbtnHovered, setSuccessbtnHovered] = useState(false);
    const [btnBackgroundColor, setBtnBackgroundColor] = useState()
    const [headerBgColor, setHeaderBgColor] = useState()
    const [btnFamily, setBtnFamily] = useState()
    const [btnHoverColor, setBtnHoverColor] = useState()
    const [btnHoverFamily, setBtnHoverFamily] = useState()

    const instructionParagraphs = validateData?.instructions?.replace(/<br\/>/g, '');
    const storedContactInfo = JSON.parse(localStorage.getItem('contactInfo')) || { name: '', email: '', phone: '' };
    const [mapData, setMapData] = useState(attributeData);
    const [submitSuccessFull, SetSubmitSuccessFull] = useState(false)
    const [optionalField, SetOptionalField] = useState(true)
    const [selectedFiles, setSelectedFiles] = useState([]);

    const [siteCharacteristics, SetSiteCharacteristics] = useState([])
    const [timeStamp, setTimeStamp] = useState(false)
    // const timestampRef = useRef('');
    const [expandedGroups, setExpandedGroups] = useState({});

    // const validateAttributeData = validateData?.attributes;
    const [validateAttributeData, setValidateAttributeData] = useState([])
    // const [groupedAttributes, setGroupedAttributes] = useState([])

    const [formData, setFormData] = useState({});
    const [checkSubmit, setCheckSubmit] = useState(false);
    const [backgroundColor, setBackGroundColor] = useState()
    const [loading, setLoading] = useState(false);
    const [openStates, setOpenStates] = useState({});
    const fileInputRef = useRef(null)
    const timestampRef = useRef(Date.now());
    const [errorMessages, setErrorMessages] = useState([]);
    const timeoutRef = useRef(null);
    const maxFileSize = 10485760; // 10MB in bytes
    const maxFiles = 5;

    useEffect(() => {
        let customData = validateData?.attributes;

        if (customData) {
            const updatedCustomData = customData.map(item => {
                const newItem = { ...item };
                const element = newItem?.tyo;
                if (element?.length > 0) {
                    // console.log("161",element)
                    // newItem.tyo = ["|Select an option", ...element];
                }
                return newItem;
            });
            // console.log("updatedCustomData",updatedCustomData)
            setValidateAttributeData(updatedCustomData)
        }
    }, [validateData]);

    useEffect(() => {
        const initialData = {};
        validateAttributeData?.forEach((attribute) => {
            // Check if ty is 5
            if (attribute.ty === 5) {
                initialData[attribute.columnName] = "No"; // Store "No" if ty is 5
            } else {
                initialData[attribute.columnName] = attribute.tyo ? getDefaultOption(attribute) : attribute.dv ?attribute.dv : '';
            }
        });

        setFormData(initialData);
        setCheckSubmit(false)
    }, [validateAttributeData, checkSubmit]);

    const getDefaultOption = (attribute) => {
        if (attribute.tyo && attribute.tyo.length > 0) {

            // const [defaultValue] = attribute.tyo.find(option => option.startsWith(''))?.split('|') || [attribute.dv];
            // return defaultValue;
            // console.log("att",attribute?.columnName , attribute.dv)
            const defaultValue = attribute.dv == null
                ? (attribute.tyo.find(option => option === attribute.dv)?.split('|')[0]
                || attribute.tyo.find(option => option.startsWith(''))?.split('|')[0]
                || null)
                : ( attribute.tyo.find(option => option.split('|')[0] === attribute.dv)?.split('|')[0] 
                || attribute.tyo[0]?.split('|')[0] 
                || null);
            return defaultValue;

        }

        return attribute.dv || '';
    };

    const handleInputChange = (columnName, value) => {
        setFormData(prevData => ({ ...prevData, [columnName]: value }));
    };

    useEffect(() => {
        if (!timestampRef.current) {
            timestampRef.current = Date.now();
        } else {
            if (timeStamp === true) {
                timestampRef.current = Date.now();
                setTimeStamp(false)
            }
        }
    }, [timeStamp]);


    useEffect(() => {
        if (validateData?.siteStyle) {
            const regex = /font-family:\s*([^;]*)/; //Style
            const regex1 = /color:\s*([^;]*)/; //font-color
            const buttonnRegex = /background-color:\s*([^;]*)/; //btn BGCOLOR
            const backgroundRegex = /background-color:\s*([^;]*)/;
            const styleMatch = validateData?.siteStyle?.fontGeneral?.match(regex);
            const fontColorMatch = validateData?.siteStyle?.fontGeneral?.match(regex1);
            const btnBGColorMatch = validateData?.siteStyle?.buttonStyle?.match(buttonnRegex);
            const btnFamilyMatch = validateData?.siteStyle?.buttonStyle?.match(regex);
            const btnHoverMatch = validateData?.siteStyle?.buttonHover?.match(buttonnRegex);
            const btnHoverFamilyMatch = validateData?.siteStyle?.buttonHover?.match(regex);
            const headerBgColorMatch = validateData?.siteStyle?.backgroundStyle?.match(buttonnRegex);

            const extractStyle = (styleString, regex) => {
                const match = styleString.match(regex);
                return match ? match[1].trim() : null;
            };

            const backgroundColor = extractStyle(validateData?.siteStyle?.backgroundStyle, backgroundRegex);

            if (styleMatch) {
                const fontsFamily = styleMatch[1].trim();
                setFontFamilys(fontsFamily) //General fonts Style
            }
            if (fontColorMatch) {
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
            if (headerBgColorMatch) {
                const headerbgColorValue = headerBgColorMatch[1].trim();
                setHeaderBgColor(headerbgColorValue)
            }
            if (backgroundColor) {
                setBackGroundColor(backgroundColor);
            }
        }
    }, [])

    useEffect(() => {
        const data = locationDetail
        if (data) {

            setMapData((prevMapData) => ({
                ...prevMapData,
                mapName: locationDetail,
                name: storedContactInfo?.name || '',
                email: storedContactInfo?.email || '',
                phone: storedContactInfo?.phone || '',
                // pco_name: addressDetails ? addressDetails?.formattedAddress : '',
                // pco_address: addressDetails ? addressDetails?.formattedAddress : '',
                // pco_city: addressDetails ? addressDetails?.structuredAddress['locality,political'] : '',
                // pco_state: addressDetails ? addressDetails?.structuredAddress['administrative_area_level_1,political'] : '',
                // pco_zipcode: addressDetails ? addressDetails?.structuredAddress?.postal_code : ''
            }));
        } else {
            setMapData((prevMapData) => ({
                ...prevMapData,
                mapName: locationDetail,
                name: storedContactInfo?.name || '',
                email: storedContactInfo?.email || '',
                phone: storedContactInfo?.phone || '',
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

    const handleSubmit = async (e) => {
        setLoading(true)
        e.preventDefault()
        await uploadfile()
        let formDataCopy = { ...formData };

        validateAttributeData.forEach(attribute => {
            const { columnName, columnType, tyo } = attribute;
            let value = formDataCopy[columnName];
            if (tyo?.length > 0 && value === null) {
                const defaultValue = tyo.find(option => option.startsWith(''))?.split('|')[0];  // Get the first element
                formDataCopy[columnName] = defaultValue; // Assign the single value, not the array
            }
            value = formDataCopy[columnName];
            if (value !== "") {
                if (columnType === 1) {
                    formDataCopy[columnName] = JSON.parse(value);
                } else if (columnType === 2) {
                    formDataCopy[columnName] = parseFloat(value).toFixed(1);
                } else if (columnType === 0) {
                    formDataCopy[columnName] = String(value);
                }
            }
        });
        const formattedAddress = [addressDetails.streetNumber, addressDetails.premise, addressDetails.route, addressDetails.political, addressDetails.sublocality].filter(Boolean).join(', ');

        let submitfiles = selectedFiles.map(file => `${file.path}`);
        const payload = {
            email: mapData.email,
            from: mapData.name,
            phone: mapData.phone,
            id: validateData.id,
            sites: [
                {
                    site: {
                        latitude: position.lat,
                        longitude: position.lng,
                    },
                    address: {
                        address: addressDetails.addresses,
                        city: addressDetails.city ? addressDetails.city : '',
                        state: addressDetails.state ? addressDetails.state : '',
                        country: addressDetails.country ? addressDetails.country : '',
                        zipcode: addressDetails.zipcode ? addressDetails.zipcode : ''
                    },
                    name: mapData.mapName,
                    comment: mapData.comments,
                    attributes: formDataCopy,
                    uploads: submitfiles,
                }
            ]
        }

        const urlParams = new URLSearchParams(window.location.search);
        const accessKey = urlParams.get("accessKey");

        if (accessKey != null) {
            payload.accessKey = accessKey;
        }

        const contactInfo = {
            name: mapData.name,
            email: mapData.email,
            phone: mapData.phone
        }
        try {
            const response = await axios.post('https://submitapi.sitewise.com/submit', payload);
            // console.log('API Response:', response);
            SetSubmitSuccessFull(true)
            localStorage.setItem('contactInfo', JSON.stringify(contactInfo));
            // message.success('Site Submitted successfully');
            onClose()
            setMapData({ mapName: '', comments: '' })
            setSelectedFiles([])
            setTimeStamp(true)
            dispatch(setAttributesData(mapData));
            setCurrentStep(1);
            dispatch(setContactScreenShowHide(false))
            setFormData({});
            setLoading(false)
        } catch (error) {
            message.error(error);
            setLoading(false)
        }

    }

    const submitAnotherSite = () => {
        SetSubmitSuccessFull(false)
        setCheckSubmit(true)
        setCurrentStep(1);
    }

    const handleChangeInput = (key, value) => {
        if (key === 'phone') {
            value = value.slice(0, 20);
        }

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
                    hoverBG={backgroundColor}
                />
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

    const onDrop = useCallback((acceptedFiles, rejectedFiles) => {
        const errorMessages = [];
        const totalFilesCount = selectedFiles.length + acceptedFiles.length;
        if (totalFilesCount > 5) {
            const filesToAccept = acceptedFiles.slice(0, 5 - selectedFiles.length);
            const filesRejectedForLimit = acceptedFiles.length - filesToAccept.length;
            if (filesRejectedForLimit > 0 && !errorMessages.includes("You can only upload a maximum of 5 files.")) {
                errorMessages.push("You can only upload a maximum of 5 files.");
            }
            acceptedFiles = filesToAccept;
        }
        rejectedFiles.forEach(file => {
            file.errors.forEach(error => {
                if (error.code === 'file-too-large') {
                    if (!errorMessages.includes("The file is too large. Max size is 10MB.")) {
                        errorMessages.push("The file is too large. Max size is 10MB.");
                    }
                } else if (error.code === 'file-invalid-type') {
                    if (!errorMessages.includes("The file has an unsupported format. Allowed formats: JPG, PNG, GIF, PDF, SVG.")) {
                        errorMessages.push("The file has an unsupported format. Allowed formats: JPG, PNG, GIF, PDF, SVG.");
                    }
                } else if (!errorMessages.includes(error.message)) {
                    errorMessages.push(error.message);
                }
            });
        });

        if (errorMessages.length > 0) {
            const uniqueErrorMessages = [...new Set(errorMessages)];
            setErrorMessages(uniqueErrorMessages);

            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(() => {
                setErrorMessages([]);
            }, 10000);
        } else {
            const existingFileHashes = new Set(
                selectedFiles.map(file => `${file.name}-${file.size}-${file.lastModified}`)
            );

            const newFiles = acceptedFiles.filter(file => {
                const fileHash = `${file.name}-${file.size}-${file.lastModified}`;
                if (existingFileHashes.has(fileHash)) {
                    if (!errorMessages.includes(`The file '${file.name}' has already been uploaded.`)) {
                        const truncatedFileName = truncate(file.name, 30);
                        errorMessages.push(`The file '${truncatedFileName}' has already been uploaded.`);
                    }
                    return false;
                }
                return true;
            });

            if (errorMessages.length > 0) {
                setErrorMessages(prevMessages => [...new Set([...prevMessages, ...errorMessages])]);
                if (timeoutRef.current) {
                    clearTimeout(timeoutRef.current);
                }
                timeoutRef.current = setTimeout(() => {
                    setErrorMessages([]);
                }, 10000);
            } else {
                const filesWithTimestamp = newFiles.map(file => ({
                    ...file,
                    lastModified: file.lastModified,
                    lastModifiedDate: file.lastModifiedDate,
                    name: file.name,
                    type: file.type,
                    size: file.size,
                    file: file,
                    path: `submitter/${timestampRef.current}/${file.name}`
                }));

                setSelectedFiles(prevFiles => [...prevFiles, ...filesWithTimestamp]);
            }
        }
    }, [selectedFiles]);



    async function uploadfile() {
        try {
            if (selectedFiles.length > 0) {
                const payload = selectedFiles.map(file => ({
                    fileName: `${file.path}`,
                    contentType: file.type
                }));

                const response = await axios.post('https://submitapi.sitewise.com/attach_urls', payload);

                const combinedData = response.data.map((url, index) => ({
                    url,
                    file: selectedFiles[index].file,
                    contentType: payload[index].contentType
                }));

                await uploadFilesToS3(combinedData)
            }
        } catch (error) {
            message.error(error);
        }
    }

    const uploadFilesToS3 = async (data) => {
        try {
            await Promise.all(
                data.map((file) => {
                    return new Promise((resolve, reject) => {
                        const options = {
                            headers: {
                                'Content-Type': file.contentType
                            }
                        };

                        let reader = new FileReader();

                        reader.readAsArrayBuffer(file.file);

                        reader.onload = async () => {
                            let arrayBuffer = reader.result;

                            try {
                                await axios.put(file.url, arrayBuffer, options);
                                // console.log('after save!');
                                resolve();
                            } catch (error) {
                                reject(error);
                            }
                        };

                        reader.onerror = (error) => reject(error);
                    });
                })
            );
        } catch (error) {
            console.error(error);
        }
    };

    const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
        // accept: ['application/pdf', 'image/gif', 'image/jpeg', 'image/png'],  // Allowed file formats
        accept: {
            'application/pdf': [],
            'image/gif': [],
            'image/jpeg': [],
            'image/png': []
        },
        maxSize: maxFileSize,
        maxFiles: maxFiles,
        onDrop,
    });
    const handleBrowseClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
            fileInputRef.current.click();
        }
    };
    const removeFile = (fileName) => {
        setSelectedFiles(prevFiles => prevFiles.filter(file => file.name !== fileName));
        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };
    function truncate(str, maxLength = 30, startChars = 23, endChars = 7) {
        if (str.length <= maxLength) {
            return str;
        }
        const start = str.slice(0, startChars);
        const end = str.slice(-endChars);
        return `${start}...${end}`;
    }
    const renderFiles = () => {
        return selectedFiles.map((file) => (
            <Row style={{ marginTop: 15 }}>
                <Col span={22}>
                    {/* <div>{file.name}</div> */}
                    <div style={{ ...styles.fileListText, fontFamily: fontFamilys ? fontFamilys : '', color: fontColor ? fontColor : '', textOverflow: 'ellipsis', overflow: 'hidden', marginRight: 20 }}>
                        {truncate(file.name)}
                    </div>
                </Col>
                <Col span={2}>
                    <div style={{ ...styles.textEnd, marginLeft: 10 }} onClick={() => removeFile(file.name)}>
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

    const declaimerText = validateData && validateData.disclaimer ? validateData.disclaimer : ''
    const groupBy = (data, key) => {
        return data?.reduce((acc, current) => {
            const groupKey = current[key]?.replace('^', '').trim() || 'undefined';
            if (!acc.groupedAttributes[groupKey]) {
                acc.groupedAttributes[groupKey] = [];
            }
            acc.groupedAttributes[groupKey].push(current);

            acc.presenceTracker[groupKey] = true;

            return acc;
        }, { groupedAttributes: {}, presenceTracker: {} });
    };
    const { groupedAttributes, presenceTracker } = useMemo(() => {
        return groupBy(validateAttributeData, 'grp');
    }, [validateAttributeData]);
    useEffect(() => {
        setExpandedGroups(presenceTracker);
    }, [presenceTracker]);
    const toggleGroup = (groupName) => {
        // console.log("Call toggleGroup", expandedGroups);

        setExpandedGroups((prev) => ({
            ...prev,
            [groupName]: !prev[groupName],
        }));
    };

    const handleDropdownOpenChange = (columnName, isOpen) => {
        setOpenStates(prev => ({ ...prev, [columnName]: isOpen }));
    };

    return (
        <div style={styles.container} className={"layerContainer"}>
            {/* {saveModal}
      {layerGroup} */}
            <LeftDrawerContent title="Layers">
                <div style={styles.topBox}>
                    <div style={styles.containerDiv} className={'containerDiv'}>
                        {currentStep === 1 && submitSuccessFull === false &&
                            <>
                                <div style={{
                                    fontFamily: fontFamilys ? fontFamilys : '',
                                    color: fontColor ? fontColor : '#021E4F',
                                    fontWeight: 700,
                                    fontSize: '14px',
                                    margin: '15px 2px'
                                }}>{instructionParagraphs}</div>
                                <Search backgroundColor={backgroundColor} />
                                <div style={{ marginTop: 8, alignItems: 'flex-end', textAlign: 'right' }}>
                                    {/* <div
                                        className={'selectOnTheMap'}
                                        onClick={selectedOnTheMap}
                                        style={{
                                            fontFamily: fontFamilys ? fontFamilys : '',
                                            color: fontColor ? fontColor : '#0087b7',
                                            fontSize: 14, cursor: 'pointer'
                                        }}>
                                        <Marker color={fontColor ? fontColor : '#0087b7'} size="14" /> Select On the Map
                                    </div> */}
                                    <div
                                        className={'selectOnTheMap'}
                                        onClick={selectedOnTheMap}
                                        style={{
                                            fontFamily: fontFamilys ? fontFamilys : '',
                                            color: fontColor ? fontColor : '#0087b7',
                                            fontSize: 14,
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'flex-end',
                                            gap: '5px'
                                        }}
                                    >
                                        <Marker color={fontColor ? fontColor : '#0087b7'} size="14" />
                                        Select On the Map
                                    </div>
                                </div>

                                {viewSideDetailFields === true ? <div style={styles.mapDetailsContainer}>
                                    <Row>
                                        <Col span={22}
                                            style={{
                                                ...styles.inputLabel,
                                                fontFamily: fontFamilys ? fontFamilys : '',
                                                color: fontColor ? fontColor : '',
                                            }}
                                        >
                                            {locationDetail}
                                        </Col>
                                        <Col span={2} style={{ display: 'flex', justifyContent: 'end', position: 'inherit' }}> <DeleteOutlined onClick={onClose} style={styles.inputLabel} /></Col>
                                    </Row>
                                    {renderInput('mapName', 'Name', mapData.mapName, 'text', 'Site Name', viewSideDetailFields)}
                                    {renderInput('comments', 'Comments', mapData.comments, 'text-area', 'Comments')}

                                    <div>
                                        {validateAttributeData.length > 0 && (
                                            <div>
                                                <div onClick={() => SetOptionalField(true)} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                                                    <div style={{
                                                        fontFamily: 'Poppins',
                                                        fontSize: 17,
                                                        fontWeight: 700,
                                                        lineHeight: '25.5px',
                                                        textAlign: 'left',
                                                        color: '#021E4F'
                                                    }}>Site Characteristics</div>
                                                </div>
                                                {/* {optionalField && groupedAttributes.length > 0 && Object.entries(groupedAttributes)?.map(([groupName, attributes]) => ( */}
                                                {optionalField && groupedAttributes && Object.keys(groupedAttributes).length > 0 &&
                                                    Object.entries(groupedAttributes).map(([groupName, attributes]) => (
                                                        <div key={groupName} style={{ marginTop: 10, marginBottom: 10 }}>
                                                            {groupName !== 'undefined' ? (
                                                                <div style={{ display: 'flex', alignItems: 'center', cursor: 'pointer', marginBottom: -4 }} onClick={() => toggleGroup(groupName)}>
                                                                    <span style={{
                                                                        // border: '1px solid #0087b7',
                                                                        padding: '0px',
                                                                        // display: 'flex',
                                                                        alignItems: 'center',
                                                                        justifyContent: 'flex-start',
                                                                        width: '25px',
                                                                        height: '25px',
                                                                        borderRadius: '4px',
                                                                        // marginRight: '8px',
                                                                        fontSize: '16px',
                                                                        color: '#021E4F',
                                                                    }}>
                                                                        {expandedGroups[groupName] ? <CaretDownOutlined /> : <CaretRightOutlined />}
                                                                    </span>
                                                                    <span style={{
                                                                        color: '#021E4F',
                                                                        fontFamily: 'Roboto',
                                                                        fontSize: 14,
                                                                        fontWeight: 700,
                                                                        lineHeight: '16.41px',
                                                                        textAlign: 'left',

                                                                    }}>{groupName}</span>
                                                                </div>
                                                            ) : null}

                                                            {expandedGroups[groupName] && attributes.map(attribute => {
                                                                return (
                                                                    <div key={attribute.columnName} style={{ marginLeft: groupName !== 'undefined' ? 10 : 0 }}>
                                                                        {attribute.tyo ? (
                                                                            <div style={{ margin: '8px 0px' }}>
                                                                                <Col span={24} style={{ ...styles.inputLabel }}>
                                                                                    {attribute.description}
                                                                                </Col>
                                                                                <Col span={24} style={styles.inputs}>
                                                                                    {/* <Select
                                                                                    style={{ width: '100%'}}    
                                                                                    value={formData[attribute.columnName]}
                                                                                    onChange={(e) => handleInputChange(attribute.columnName, e)}
                                                                                    onDropdownVisibleChange={(isOpen) => handleDropdownOpenChange(attribute.columnName, isOpen)}
                                                                                    placeholder={attribute.description}
                                                                                    suffixIcon={openStates[attribute.columnName] ? <CaretUpOutlined /> : <CaretDownOutlined />}
                                                                                >
                                                                                    {attribute.tyo?.map((option) => {
                                                                                        const [value, label] = option.split('|');
                                                                                        return (
                                                                                            <Option key={value} value={value}>
                                                                                                {label}
                                                                                            </Option>
                                                                                        );
                                                                                    })}
                                                                                </Select> */}
                                                                                    <Select
                                                                                        style={{ width: '100%' }}
                                                                                        activeBorderColor={'red'}
                                                                                        placeholder="Select an option"
                                                                                        value={formData[attribute.columnName] || undefined}
                                                                                        onDropdownVisibleChange={(isOpen) => handleDropdownOpenChange(attribute.columnName, isOpen)}
                                                                                        suffixIcon={openStates[attribute.columnName] ? <UpOutlined /> : <DownOutlined />}
                                                                                        optionFilterProp="label"
                                                                                        onChange={(e) => handleInputChange(attribute.columnName, e)}
                                                                                    >
                                                                                        {attribute.tyo?.map((option) => {
                                                                                            const [value, label] = option.split('|');
                                                                                            return (
                                                                                                <Option key={value} value={value}>
                                                                                                    {label === "NA" ? "N/A" : label}
                                                                                                </Option>
                                                                                            );
                                                                                        })}

                                                                                    </Select>
                                                                                </Col>
                                                                            </div>
                                                                        ) : (
                                                                            <div style={{ display: 'flex', flexDirection: "column", margin: '8px 0px' }}>
                                                                                {attribute.ty !== 5 ? (
                                                                                    <Col span={24} style={{ ...styles.inputLabel }}>
                                                                                        {attribute.description}
                                                                                    </Col>
                                                                                ) : null}
                                                                                <Col span={24} style={styles.inputs}>
                                                                                    {attribute.ty === 5 ? (
                                                                                        <Checkbox
                                                                                            checked={formData[attribute.columnName] === "Yes"}
                                                                                            onChange={(e) => handleInputChange(attribute.columnName, e.target.checked ? "Yes" : "No")}
                                                                                        >
                                                                                            {attribute.description}
                                                                                        </Checkbox>


                                                                                    ) : (
                                                                                        <AntInput
                                                                                            placeholder={'Enter Text'}
                                                                                            type={attribute.columnType === 0 ? "text" : "number"}
                                                                                            value={formData[attribute.columnName]}
                                                                                            onChange={(e) => handleInputChange(attribute.columnName, e.target.value)}
                                                                                        />
                                                                                    )}
                                                                                </Col>
                                                                            </div>
                                                                        )}
                                                                    </div>
                                                                )
                                                            })}
                                                        </div>
                                                    ))}
                                            </div>
                                        )}
                                    </div>

                                </div> :

                                    <div style={styles.noLocationContainer}>
                                        <div>
                                            <Row style={styles.noLocation}>
                                                <label style={{
                                                    fontFamily: fontFamilys ? fontFamilys : '',
                                                    color: fontColor ? fontColor : '',
                                                }}>No location to show yet</label>
                                            </Row>
                                            <Row style={{ ...styles.noLocationSearch, }}>
                                                <label style={{
                                                    fontFamily: fontFamilys ? fontFamilys : '',
                                                    color: fontColor ? fontColor : '',
                                                }}>please search</label>
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
                                                fontFamily: fontFamilys ? fontFamilys : '',
                                                color: fontColor ? fontColor : '',
                                            }}
                                        >
                                            Attach Files (Optional)<br />
                                            <span style={{
                                                marginTop: 7,
                                                ...styles.fileFormatText,
                                                fontFamily: fontFamilys ? fontFamilys : '',
                                                color: fontColor ? fontColor : '',
                                            }}>
                                                For example, attach a site plan, shopping center info sheet, etc.
                                            </span>
                                        </Col>
                                    </Row>
                                    <div style={styles.uploadContainer}>
                                        <div {...getRootProps()} className={`dropzone ${isDragActive ? 'active' : ''}`}>
                                            <input {...getInputProps()} />
                                            <p style={styles.textCenter}>
                                                <UploadIcon color={headerBgColor ? headerBgColor : ''} size="14" />
                                            </p>
                                            <p style={{
                                                ...styles.infoText,
                                                fontFamily: fontFamilys ? fontFamilys : '',
                                                color: fontColor ? fontColor : '',
                                            }}>
                                                <i className="fas fa-cloud-upload-alt"></i> Drag and drop files here
                                            </p>
                                            <p style={{
                                                ...styles.infoText,
                                                fontFamily: fontFamilys ? fontFamilys : '',
                                                color: fontColor ? fontColor : '',
                                            }}>or</p>
                                        </div>
                                        <div {...getRootProps()}>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                {...getInputProps()}
                                                style={{ display: 'none' }} // Hide the file input
                                                onChange={(e) => {
                                                    const files = e.target.files;
                                                    if (files.length > 0) {
                                                        onDrop(Array.from(files));
                                                    }
                                                }}
                                            />
                                            <Button
                                                onMouseEnter={handleBrowsekMouseEnter}
                                                onMouseLeave={handleBrowseMouseLeave}
                                                style={{
                                                    ...styles.BrowseButton,
                                                    fontFamily: btnFamily ? (browsebtnHovered ? btnHoverFamily : btnFamily) : '',
                                                    backgroundColor: btnBackgroundColor ? (browsebtnHovered ? btnHoverColor : 'white') : (browsebtnHovered ? '#0087b7' : 'white'),
                                                    color: btnBackgroundColor ? (browsebtnHovered ? 'white' : (btnBackgroundColor ? btnBackgroundColor : 'black')) : (browsebtnHovered ? 'white' : '#0087b7'),
                                                    borderColor: btnBackgroundColor ? (browsebtnHovered ? "white" : (btnBackgroundColor ? btnBackgroundColor : 'transparent')) : (browsebtnHovered ? 'white' : '#0087b7'),
                                                    border: btnBackgroundColor ? '1px solid' + btnBackgroundColor : '1px solid #0087b7',
                                                    borderRadius: '6px',
                                                }}
                                                onClick={handleBrowseClick}
                                            >
                                                + Browse Files
                                            </Button>
                                        </div>
                                        <br />
                                        {/* Error messages for invalid file formats or max files */}
                                        <div style={{
                                            marginTop: 7,
                                            ...styles.fileFormatText,
                                            fontFamily: fontFamilys ? fontFamilys : '',
                                            color: fontColor ? fontColor : '',
                                        }}>
                                            The following formats can be uploaded: .pdf, .gif, .jpg or .png
                                        </div>
                                    </div>
                                    <div>
                                        {errorMessages.length > 0 && (
                                            <ul
                                                style={{
                                                    color: 'red',
                                                    padding: '10px',
                                                    listStyleType: 'none',
                                                    wordWrap: 'break-word',
                                                    whiteSpace: 'normal',
                                                    overflowWrap: 'break-word',
                                                    maxWidth: '100%',
                                                    wordBreak: 'break-all',
                                                    paddingLeft: '0px'
                                                }}
                                            >
                                                {errorMessages.map((errorMessage, index) => (
                                                    <li key={index} style={{ marginBottom: '5px' }}>
                                                        {errorMessage}
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>

                                    <div style={{ marginTop: 14 }}>
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
                            <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: "space-between" }}>
                                <div>
                                    <Row>
                                        <Col span={24} style={{
                                            ...styles.mapDetailHeading,
                                            fontFamily: fontFamilys ? fontFamilys : '',
                                            color: fontColor ? fontColor : '',
                                        }}>Contact Information</Col>
                                    </Row>
                                    {renderInput('name', 'Name', mapData.name, 'text', 'Name')}
                                    {renderInput('email', 'Email Address', mapData.email, 'text', 'Email Address')}
                                    {renderInput('phone', 'Phone Number', mapData.phone, 'text', 'Phone Number')}

                                </div>
                                <div style={styles.disclaimer}>{declaimerText}</div>
                            </div>
                        }


                        {submitSuccessFull === true && <div style={{ width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', flexDirection: 'column', marginTop: 60 }}>
                                <SuccessIcon color={headerBgColor ? headerBgColor : ''} size="14" />
                                <div style={{
                                    fontFamily: fontFamilys ? fontFamilys : 'Poppins',
                                    color: fontColor ? fontColor : '#0087B7',
                                    marginTop: 9,
                                    fontSize: 14,
                                    fontWeight: 700,
                                }}>Thank you for submitting your site</div>
                                <Button onClick={submitAnotherSite}
                                    onMouseEnter={handleSuccesskMouseEnter}
                                    onMouseLeave={handleSuccessMouseLeave}
                                    style={{

                                        fontFamily: btnFamily ? (successbtnHovered ? btnHoverFamily : btnFamily) : '',
                                        backgroundColor: btnBackgroundColor ? (successbtnHovered ? btnHoverColor : 'white') : (successbtnHovered ? '#0087b7' : 'white'),
                                        color: btnBackgroundColor ? (successbtnHovered ? 'white' : (btnBackgroundColor ? btnBackgroundColor : 'black')) : (successbtnHovered ? 'white' : '#0087b7'),
                                        borderColor: btnBackgroundColor ? (successbtnHovered ? "white" : (btnBackgroundColor ? btnBackgroundColor : 'transparent')) : (successbtnHovered ? 'white' : '#0087b7'),
                                        border: btnBackgroundColor ? '1px solid' + btnBackgroundColor : '1px solid #0087b7',
                                        borderRadius: '6px',
                                        // border: '1px solid #0087B7', 
                                        // background: '#0087B7', 
                                        fontWeight: 500,
                                        fontSize: 14,
                                        // fontFamily: 'Roboto', 
                                        // color: '#FFF', 
                                        marginTop: 24
                                    }}>Submit Another Site</Button>
                            </div>
                        </div>}

                    </div>
                </div>


                {submitSuccessFull === false && <div style={styles.bottomBox}>
                    <div style={{ width: '100%' }}>
                        <Row style={{ padding: '15px' }}>
                            <Col style={{ marginRight: 'auto' }}>
                                {currentStep !== 1 && (
                                    <Button
                                        onMouseEnter={handleBackMouseEnter}
                                        onMouseLeave={handleBackMouseLeave}
                                        style={{
                                            fontFamily: btnFamily ? (backHovered ? btnHoverFamily : btnFamily) : '',
                                            backgroundColor: btnBackgroundColor ? (backHovered ? btnHoverColor : 'white') : (backHovered ? '#0087b7' : 'white'),
                                            color: btnBackgroundColor ? (backHovered ? 'white' : (btnBackgroundColor ? btnBackgroundColor : 'black')) : (backHovered ? 'white' : '#0087b7'),
                                            borderColor: btnBackgroundColor ? (backHovered ? "white" : (btnBackgroundColor ? btnBackgroundColor : 'transparent')) : (backHovered ? 'white' : '#0087b7'),
                                            border: btnBackgroundColor ? '1px solid' + btnBackgroundColor : '1px solid #0087b7',
                                            borderRadius: '6px'
                                        }} onClick={handleBackStep}>Back</Button>

                                )}
                            </Col>
                            <Col style={{ marginLeft: 'auto' }}>
                                <Button
                                    // style={styles.modalButton}
                                    onMouseEnter={handleMouseEnter}
                                    onMouseLeave={handleMouseLeave}
                                    style={{
                                        fontFamily: btnFamily ? (hovered ? btnHoverFamily : btnFamily) : '',
                                        backgroundColor: btnBackgroundColor ?
                                            ((currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "") ||
                                                currentStep === 3 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                                ? 'white' : (hovered ? btnBackgroundColor : 'white')) : (hovered ? '#0087b7' : 'white'),
                                        color: btnBackgroundColor ? ((currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "") ||
                                            currentStep === 3 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                            ? '#ccc' : (hovered ? 'white' : (btnBackgroundColor ? btnBackgroundColor : 'black'))) : (hovered ? 'white' : '#0087b7'),
                                        borderColor: btnBackgroundColor ? ((currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "") ||
                                            currentStep === 3 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                            ? '#aeb9ca' : (hovered ? "white" : (btnBackgroundColor ? btnBackgroundColor : 'transparent'))) : (hovered ? 'white' : '#0087b7'),
                                        borderWidth: btnBackgroundColor ? ((currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "") ||
                                            currentStep === 3 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                            ? '1px' : '1px') : '1px',
                                        borderStyle: 'solid',
                                        borderRadius: '6px'
                                    }}
                                    onClick={currentStep === 1 || currentStep === 2 ? moveNextStep : handleSubmit}
                                    disabled={
                                        loading ||
                                        (currentStep === 1 && (!viewSideDetailFields || mapData.mapName === "")) ||
                                        (currentStep === 3 && (mapData.name === "" || mapData.email === "" || !isValidEmail(mapData.email)))
                                    }
                                    className={btnBackgroundColor ? "" : 'sitewise-rect-primary-button'}
                                >
                                    {loading ? 'Loading...' : (currentStep === 1 || currentStep === 2 ? 'Next' : 'Submit')}
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
    container: { display: "flex", flexDirection: "column", height: "100%" },
    topBox: { height: "calc(100% - 135px)", backgroundColor: '#FAFAFC', overflow: 'auto' },
    bottomBox: { height: "65px", borderTop: '1px solid #AEB9CA', backgroundColor: '#FFFFFF' },
    containerDiv: { padding: '15px', height: '-webkit-fill-available' },
    disclaimer: { fontFamily: 'Roboto', fontSize: '14px', fontWeight: 500, lineHeight: '16.41px', textAlign: 'left', color: 'rgba(0, 36, 93, 0.7)' },
    mapDetailsContainer: {
        padding: '15px',
        border: '1px solid #AEB9CA',
        borderRadius: '5px',
        margin: '10px 0',
        backgroundColor: '#FFFFFF',

    },
    input: {
        margin: '16px 0'
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
        textAlign: 'end',
        cursor: 'pointer'
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