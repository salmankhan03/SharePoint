import React, { useCallback, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
// import { notification } from 'antd';
import { GoogleMap, DrawingManager } from "@react-google-maps/api";
import _ from "lodash";
// import SearchInfo from "./SearchInformation";

// import Directions from './Directions';
// import Coords from './Coords';
// import Layers from "./Layers";
// import PushpinInfo from "./PushpinInfo";
// import StudyAreaInfo from './StudyAreaInfo';
// import ReportWizardInfo from './ReportWizardInfo';
// import StudyAreas from './StudyAreas';
// import ReportAreas from './ReportAreas';
// import ReportTradeAreas from './ReportTradeAreas';
// import InfoShape from './InfoShape';
// import ScenarioShape from './ScenarioShape';
// import GeoLassoDrawer from './GeoLassoDrawer';
// import LayersPoint from './LayersPoint';

// import {
//     setMapProps,
//     saveMapRef,
//     setMapZoom,
//     setMapBounds,
//     startMapMeasure
// } from '../../actions/map';
// import {
//     computePolygonStudyArea,
//     createStudyArea,
//     dropStudyArea,
//     editGeoBuilderBoundary,
//     endGeoDrawing,
//     selectGeoAreaInCoords,
//     setGeoBuilderProps
// } from '../../actions/studyareas';
// import { setNewScenarioProps } from '../../actions/scenarios';
// import { editReportWizardPolygonArea, editReportWizardBoundary } from '../../actions/reportwizards';
// import { editInfoPolygon, loadThematics } from '../../actions/info';
// import { addWaypoint } from '../../actions/tours';
// import { center, zoom } from '../../reducers/map';

// import useStreetView from '../../hooks/useStreetView';
// import extraMapTypes from '../../util/extra_map_types';
// import drawingToCoordsRectangle from '../../helpers/drawing_to_coords_rectangle';
import SearchInformation from './SearchInformation'
import SearchMarker from "./SearchMarker";

const streetViewOptions = {
    addressControl: true,
    enableCloseButton: true,
    zoomControlOptions: true,
};

const Map = () => {
    const { center, zoom, position, display } = useSelector((state) => state);
    // const { display } = useSelector((state) => state.display);
    const total = useSelector((state) => state);
    const [mapPosition, setMapPosition] = useState(position)

    console.log('display-------------', display)

    useEffect(() => {
        setMapPosition(position)
    }, [position])

    console.log("total:", total);
    // const ref = useSelector(state => state.map.ref);
    // const active = useSelector(state => state.map.active);
    // const reportActive = useSelector(state => state.reportwizards.active);
    // const adding = useSelector(state => state.tours.adding);
    // const newScenario = useSelector(state => state.scenarios.newScenario);
    // const scenarioActive = newScenario.active;
    // const scenarioDrawType = newScenario.type;
    // const polygonAreaId = useSelector(state => state.reportwizards.polygonAreaId);
    // const isBoundary = useSelector(
    //     state =>
    //         state.reportwizards.current === 2 &&
    //         _.get(state.reportwizards, 'selected.settings.taDef.tradeAreas[0].build.method') ===
    //             'bdy' &&
    //         state.drawers.left === 'SmartReport Wizard'
    // );
    // const isGeoBoundary = useSelector(
    //     state =>
    //         state.studyareas.geoBuilder.step === 1 && state.drawers.left === 'Geography Builder'
    // );
    // const clipping = useSelector(state => state.studyareas.clipping);
    // const appending = useSelector(state => state.studyareas.appending);
    // const infoClipping = useSelector(state => state.info.clipping);
    // const infoAppending = useSelector(state => state.info.appending);
    // const isPolygon =
    //     useSelector(state => state.studyareas.type === 'PolygonArea') ||
    //     infoClipping ||
    //     infoAppending;
    // const isGeoArea = useSelector(state => state.studyareas.type === 'GeoPolygonArea');
    // const geoActive = useSelector(state => state.studyareas.geoBuilder.active);
    // const geoDrawType = useSelector(state => state.studyareas.geoBuilder.type);
    // const geoDrawing = useSelector(state => state.studyareas.geoBuilder.drawing);
    // const redrawPolygonId = useSelector(state => state.studyareas.redrawPolygonId);
    // const mapTypeId = useSelector(state => state.map.mapTypeId);
    // const streetView = useSelector(state => state.map.streetView);
    // const measuring = useSelector(state => state.map.measuring);
    // const [geoLasso, setGeoLasso] = useState([]);
    // const [lassoListener, setLassoListener] = useState();
    // useEffect(() => {
    //     if (ref && window.google && geoDrawing) {
    //         setLassoListener(
    //             window.google.maps.event.addListener(ref, 'mousemove', e => {
    //                 setGeoLasso(geoLasso => [
    //                     ...geoLasso,
    //                     { lat: e.latLng.lat(), lng: e.latLng.lng() }
    //                 ]);
    //             })
    //         );
    //     }
    // }, [ref, geoDrawing]);
    // const dispatch = useDispatch();
    // const onClose = useCallback(() => dispatch(setMapProps('streetView')), [dispatch]);

    const [map, setMap] = useState(null);
    // const { setMap } = useStreetView(streetView, streetViewOptions, onClose);
    const onLoad = useCallback(
        (map) => {
            // dispatch(saveMapRef(map));
            setMap(map);
        },
        [setMap]
    );

    const onUnmount = useCallback(function callback(map) {
        setMap(null);
    }, []);
    // const onClick = useCallback(
    //     e => {
    //         const position = { lat: e.latLng.lat(), lng: e.latLng.lng() };
    //         if (!measuring) {
    //             if (
    //                 active &&
    //                 !isPolygon &&
    //                 !(clipping || appending || infoClipping || infoAppending)
    //             ) {
    //                 if (isGeoArea) dispatch(dropStudyArea({ position, path: 'geoBuilderInput' }));
    //                 else dispatch(createStudyArea(position));
    //                 notification.destroy();
    //             } else {
    //                 if (!active && reportActive && !polygonAreaId) {
    //                     dispatch(dropStudyArea({ position, path: 'reportInput' }));
    //                 } else {
    //                     if (isBoundary) {
    //                         dispatch(editReportWizardBoundary(position));
    //                     } else if (isGeoBoundary) {
    //                         if (geoActive && geoDrawType === 'LASSO') {
    //                             if (geoDrawing) {
    //                                 dispatch(endGeoDrawing());
    //                                 dispatch(selectGeoAreaInCoords(geoLasso));
    //                                 window.google.maps.event.removeListener(lassoListener);
    //                                 setGeoLasso([]);
    //                             } else {
    //                                 dispatch(setGeoBuilderProps('drawing', true));
    //                             }
    //                         } else {
    //                             dispatch(editGeoBuilderBoundary(position));
    //                         }
    //                     } else if (geoDrawType === 'LASSO') {
    //                         if (geoActive) {
    //                             if (geoDrawing) {
    //                                 dispatch(endGeoDrawing());
    //                                 dispatch(createStudyArea(geoLasso));
    //                                 window.google.maps.event.removeListener(lassoListener);
    //                                 setGeoLasso([]);
    //                             } else {
    //                                 dispatch(setGeoBuilderProps('drawing', true));
    //                             }
    //                         } else {
    //                             dispatch(editGeoBuilderBoundary(position));
    //                         }
    //                     } else {
    //                         if (adding) {
    //                             dispatch(addWaypoint(position));
    //                         } else {
    //                             dispatch(loadThematics(position));
    //                         }
    //                     }
    //                 }
    //             }
    //         } else {
    //             dispatch(startMapMeasure(position));
    //         }
    //     },
    //     [
    //         measuring,
    //         active,
    //         isPolygon,
    //         reportActive,
    //         polygonAreaId,
    //         isBoundary,
    //         isGeoBoundary,
    //         adding,
    //         isGeoArea,
    //         geoActive,
    //         geoDrawType,
    //         geoDrawing,
    //         geoLasso,
    //         lassoListener,
    //         clipping,
    //         appending,
    //         infoClipping,
    //         infoAppending,
    //         dispatch
    //     ]
    // );
    // const onZoomChanged = useCallback(() => dispatch(setMapZoom()), [dispatch]);
    // const onBoundsChanged = useCallback(() => dispatch(setMapBounds()), [dispatch]);
    // const onPolygonComplete = useCallback(
    //     (polygon, id, remove = true) => {
    //         if (clipping) {
    //             dispatch(computePolygonStudyArea(id, polygon, 'clip'));
    //         } else if (appending) {
    //             dispatch(computePolygonStudyArea(id, polygon, 'append'));
    //         } else if (infoClipping) {
    //             dispatch(editInfoPolygon(polygon, 'clip'));
    //         } else if (infoAppending) {
    //             dispatch(editInfoPolygon(polygon, 'append'));
    //         } else {
    //             if (polygonAreaId) {
    //                 dispatch(editReportWizardPolygonArea(polygonAreaId, polygon));
    //             } else {
    //                 dispatch(createStudyArea(polygon, id));
    //             }
    //             if (remove) {
    //                 polygon.setMap(null);
    //                 notification.destroy();
    //             }
    //         }
    //     },
    //     [polygonAreaId, clipping, appending, infoClipping, infoAppending, dispatch]
    // );
    // const onDrawingComplete = useCallback(
    //     data => {
    //         dispatch(setNewScenarioProps({ active: false, bounds: data }));
    //     },
    //     [dispatch]
    // );
    // const onGeoRectangleComplete = useCallback(
    //     data => {
    //         dispatch(endGeoDrawing());
    //         dispatch(selectGeoAreaInCoords(drawingToCoordsRectangle(data)));
    //         data.setMap(null);
    //     },
    //     [dispatch]
    // );

    const mapProps = {
        mapContainerStyle: { ...styles.map },
        // mapTypeId,
        // extraMapTypes,
        zoom,
        center,
        options: {
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
            streetViewControl: false,
            // draggableCursor:
            //     active || reportActive || geoActive || adding || measuring ? 'crosshair' : 'grab'
        },
        // clickableIcons: false,
        onLoad,
        onUnmount,
        // onClick,
        // onZoomChanged: _.debounce(onZoomChanged, 500),
        // onBoundsChanged: _.debounce(onBoundsChanged, 500)
    };

    return (
        <GoogleMap {...mapProps}>
           <SearchInformation/>
           <SearchMarker/>
        </GoogleMap>
    );
};

const styles = {
    map: { height: "100%" },
};

export default Map;
