import { configureStore, createSlice } from "@reduxjs/toolkit";
import _ from "lodash";
import { mapBounds } from "./helpers/mapLocation";
// import uuid from "uuid";


// import MeasureTool from "measuretool-googlemaps-v3";

const keyDragZoom = {
    key: 'shift',
    boxStyle: {
        border: '1px dashed black',
        backgroundColor: '#8798AD',
        opacity: 0.5
    },
    veilStyle: { backgroundColor: '#8798AD', opacity: 0 }
};

export const center = { lat: 40.117546, lng: -107.20 };
export const zoom = 5;

const initialState = {
    center,
    zoom,
    ref: {},
    bounds: {
        northeast: { lat: 48.28343872865081, lng: -120.32903621875 },
        southwest: { lat: 46.66288602407259, lng: -124.06438778125 },
    },
    firstPageBounds: {
        northeast: { lat: 48.28343872865081, lng: -120.32903621875 },
        southwest: { lat: 46.66288602407259, lng: -124.06438778125 },
    },
    mapLoading: false,
    mapResults: [],
    display: false,
    search: "",
    locationDetail: undefined,
    locationName: undefined,
    position: undefined,
    selected: undefined,
    viewSideDetailFields: false,
    validateData: undefined,
    mapTypeId: "roadmap",
    searchByButtonClick: false,
    contactScreenShowHide: false,
    rotationAngle: 0,
    tilt: false,
    addressDetails: {},
    attributeData: {}
};

const mapSlice = createSlice({
    name: "mapReducer",
    initialState,
    reducers: {
        setCurrentUserLocation: (state, action) => {
            return { ...state, center: action.payload.center, zoom: action.payload.zoom };
        },
        validateData: (state, action) => {
            return { ...state, validateData: action.payload };
        },
        setSearchProps: (state, action) => {
            return { ...state, ...action.payload };
        },
        setSearchPoint: (state, action) => {
            const { path, value } = action.payload;
            return { ...state, [path]: value };
        },
        setSearchMap: (state, action) => {
            return {
                ...state,
                mapResults: action.payload,
                mapLoading: false,
            };
        },
        closeInfo: (state, action) => {
            return {
                ...state,
                position: null,
                locationDetail: null,
                display: false,
                viewSideDetailFields: false
            };
        },
        onHideShowInfo: (state, action) => {
            return {
                ...state,
                display: action.payload,
            };
        },
        pressSearchPoint: (state, action) => {
            return {
                ...state,
                position: action.payload.item,
                center: action.payload.item,
                zoom: 17,
                display: true,
                locationName: action.payload.locationName,
                locationDetail: action.payload.locationName,
            }
        },

        addSiteDetail: (state, action) => {
            return {
                ...state,
                viewSideDetailFields: true
            };
        },
        zoom: (state, action) => {
            return { ...state, zoom: action.payload };
        },
        setLayer: (state, action) => {
            return {
                ...state,
                ...action.payload,
            };
        },
        setLocation: (state, action) => {
            return {
                ...state,
                locationDetail: action.payload.locationDetail,
                locationName: action.payload.locationName,
                center: { lat: action.payload.lat, lng: action.payload.lng },
                zoom: 15,
                position: { lat: action.payload.lat, lng: action.payload.lng },
                selected: action.payload.id,
                display: true
            };
        },
        setAddressDetails: (state, action) => {
            return {
                ...state,
                addressDetails: action.payload
            };
        },

        setPosition: (state, action) => {
            return {
                ...state,
                position: action.payload
            };
        },

        setAddress: (state, action) => {
            return {
                ...state,
                locationDetail: action.payload,
                locationName: action.payload,
            };
        },

        mapTypeId: (state, action) => {
            return { ...state, mapTypeId: action.payload };
        },
        setSelectedMapHideShow: (state, action) => {
            return {
                ...state,
                searchByButtonClick: action.payload
            };
        },
        setContactScreenShowHide: (state, action) => {
            return {
                ...state,
                contactScreenShowHide: action.payload
            };
        },
        setClockRotation: (state, action) => {
            return {
                ...state,
                rotationAngle: action.payload,
            };
        },
        setAntiClockRotation: (state, action) => {
            return {
                ...state,
                rotationAngle: action.payload,
            };
        },
        rotateMapUp: (state, action) => {
            return {
                ...state,
                tilt: action.payload,
            };
        },
        setStateProps: (state, action) => {
            const { path, value } = action.payload;
            return {
                ...state,
                [path]: value,
            };
        },
        saveMapRef: (state, action) => {
            return { ...state, ref: action.payload };
        },
        setAttributesData: (state, action) => {
            return { ...state, attributeData: action.payload };
        },

    },
});

const getLatLngPoint = (input) => {
    const comma = input.split(",");
    if (comma.length === 2) {
        return getPoint(comma);
    }
    const space = input.split(" ");
    if (space.length === 2) {
        return getPoint(space);
    }
    return false;
};

const getPoint = (coords) => {
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    const isLatValid = lat >= -90 && lat <= 90;
    const isLngValid = lng >= -180 && lng <= 180;
    if (isLatValid && isLngValid) {
        return { lat, lng };
    }
    return false;
};

export const setSearchProps = (type, text) => async (dispatch) => {
    dispatch(mapSlice.actions.setSearchProps({ [type]: text }));
};

export const setPosition = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.setPosition(value));
};

export const setAddress = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.setAddress(value));
};

export const searchLocation = (input, path) => (dispatch) => {
    const point = getLatLngPoint(input);
    if (point) {
        dispatch(mapSlice.actions.setSearchPoint({ point, path }));
    } else {
        dispatch(searchMapLocation(input));
    }
};

const formatAddress = address => {
    try {
        const structuredAddress = address.address_components.reduce(
            (result, item) => ({ ...result, [item.types]: item.short_name }),
            {}
        );
        let formattedAddress = '';
        if (structuredAddress['street_number']) {
            formattedAddress = formattedAddress + structuredAddress['street_number'] + ' ';
        }
        if (structuredAddress['route']) {
            formattedAddress = formattedAddress + structuredAddress['route'];
        }

        return formattedAddress;
    } catch (e) {
        return address.formatted_address;
    }
};

export const pressSearchPoint = (value) => async (dispatch, getState) => {
    const { item } = value;
    const { lat, lng } = item;
    const geocoder = new window.google.maps.Geocoder();

    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results.length > 0) {
            const locationName = results[0].formatted_address;

            const addressComponents = results[0].address_components;
            const addresses = results ? formatAddress(results[0]) : undefined;
            let city, state, country, zipcode;

            if (Array.isArray(addressComponents)) {
                for (const component of addressComponents) {

                    if (component.types.includes("administrative_area_level_3") || component.types.includes("locality")) {
                        city = component.long_name;
                    } else if (component.types.includes("administrative_area_level_1")) {
                        state = component.long_name;
                    } else if (component.types.includes("country")) {
                        country = component.long_name;
                    } else if (component.types.includes("postal_code")) {
                        zipcode = component.long_name;
                    }
                }
            }

            dispatch(setAddressDetails({city, state, country, zipcode, addresses }))

            dispatch(mapSlice.actions.pressSearchPoint({ ...value, locationName }));
        } else {
            console.error('Geocoding failed', status);
        }
    });
};

export const searchMapLocation = (input) => (dispatch, getState) => {
    const { northeast, southwest } = getState().bounds;
    const bounds = new window.google.maps.LatLngBounds(southwest, northeast);
    dispatch(setSearchProps("mapLoading", true));
    const service = new window.google.maps.places.AutocompleteService();
    const geocoder = new window.google.maps.Geocoder();
    service.getQueryPredictions({ input, bounds }, (results) => {
        geocoder.geocode({ address: input }, (res, status) => {
            const filtered = (results || []).filter((r) => r.place_id);
            if (status === "OK" && res.length > 0) {
                const shouldAdd = !_.find(
                    results,
                    (r) => r.description === res[0].formatted_address
                );
                const combined = shouldAdd ? filtered.concat(res[0]) : filtered;
                dispatch(mapSlice.actions.setSearchMap(combined));
            } else {
                dispatch(mapSlice.actions.setSearchMap(filtered));
            }
        });
    });
};

export const saveMapRef = (map) => async (dispatch, getState) => {
    dispatch(mapSlice.actions.saveMapRef(map));
    map?.enableKeyDragZoom(keyDragZoom);
};

export const validateData = (data) => async (dispatch) => {
    dispatch(mapSlice.actions.validateData(data));
};

export const closeInfo = (value) => async (dispatch, getState) => {
    dispatch(mapSlice.actions.closeInfo(value));
};
export const onHideShowInfo = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.onHideShowInfo(value));
};

export const addSiteDetail = (value) => async (dispatch, getState) => {
    dispatch(mapSlice.actions.addSiteDetail(value));
};

export const setLocation = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.setLocation(value));
};
export const setAddressDetails = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.setAddressDetails(value));
};

export const setLayer = (field, value) => async (dispatch) => {
    dispatch(mapSlice.actions.setLayer({ [field]: value }));
};

export const setMapTypeId = (path, value) => async (dispatch, getState) => {
    dispatch(mapSlice.actions.mapTypeId(value));
};

export const setSelectedMapHideShow = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.setSelectedMapHideShow(value));
};
export const setContactScreenShowHide = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.setContactScreenShowHide(value));
};

export const rotateMapClockwise = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.setClockRotation(value));
};

export const rotateMapAntiClockwise = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.setAntiClockRotation(value));
};
export const rotateMapUp = (value) => async (dispatch) => {
    dispatch(mapSlice.actions.rotateMapUp(value));
};


export const setStateProps = (path, value) => (dispatch, getState) => {
    dispatch(mapSlice.actions.setStateProps({ path, value }));
};

export const setMapBounds = () => async (dispatch, getState) => {
    const { ref } = getState();
    if (ref) {
        const bounds = mapBounds(ref);
        dispatch(setStateProps("bounds", bounds));
    }
};

export const setMapZoom = () => async (dispatch, getState) => {
    const ref = getState()?.ref;
    if (ref) {
        dispatch(mapSlice.actions.zoom(ref?.getZoom()));
    }
};

export const setAttributesData = (value) => (dispatch, getState) => {
    dispatch(mapSlice.actions.setAttributesData(value));
};

export const setCurrentUserLocation = (value) => (dispatch, getState) => {
    dispatch(mapSlice.actions.setCurrentUserLocation(value));
};




export default configureStore({ reducer: mapSlice.reducer });
