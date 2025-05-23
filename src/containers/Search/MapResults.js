import React, { useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, List } from "antd";
import "../../App.css";

import SearchResult from "../../components/SearchResult";

import {
  pressSearchPoint,
  setAddressDetails,
  setLocation,
  setSearchProps,
  setSelectedMapHideShow
} from "../../store";

const { Title } = Typography;
const locale = { emptyText: "No Results" };

const MapResults = ({ path, search }) => {
  const mapLoading = useSelector((state) => state.mapLoading);
  const mapResults = useSelector((state) => state.mapResults);
  const input = useSelector((state) => state.search);
  // unused code comment
  // const tot = useSelector((state) => state);
  const dispatch = useDispatch();

  let values;
  if (input.includes('/')) {
    values = input.split('/');
  } else {
    values = input.split(',');
  }
  const coordinates = {
    lat: parseFloat(values[0]),
    lng: parseFloat(values[1])
  };

  const latitudePattern = /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/;

  const longitudePattern = /^-?((1[0-7]|[1-9])?[0-9](\.[0-9]+)?|180(\.0+)?)$/;

  const isValidLatitude = latitudePattern.test(parseFloat(values[0]));
  const isValidLongitude = longitudePattern.test(parseFloat(values[1]));

  const drop = useCallback(item => dispatch(pressSearchPoint({ path, item })), [path, dispatch]);

  const handleClick = () => {
    drop(coordinates);
    dispatch(setSelectedMapHideShow(false));
    dispatch(setSearchProps("search", ""))
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


  return (
    <div className="sitewise-skeleton-search">
      <Title level={4} style={styles.header}>
        Address / Locations Found
      </Title>

      {(isValidLatitude === true && isValidLongitude === true) && (
        <div
          onClick={handleClick}
          className="ant-list-item"
          style={styles.result}
        >{`${coordinates.lat}, ${coordinates.lng}`}</div>
      )}

      {(isValidLatitude === false || isValidLongitude === false) &&
        <List
          locale={locale}
          loadMore
          dataSource={mapResults}
          renderItem={(item) => {
            const label = item.formatted_address || item.description;
            return (
              <SearchResult
                label={label}
                input={input}
                loading={mapLoading}
                onClick={() => {
                  const { terms } = item;
                  const locationTerm = terms.find((term) => term.offset === 0);
                  if (locationTerm) {
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode(
                      { address: item.description },
                      (results, status) => {
                        if (status === "OK" && results.length > 0) {
                          const addresses = results ? formatAddress(results[0]) : undefined;
                          dispatch(setAddressDetails(addresses))
                          const location = results[0].geometry.location;

                          const addressComponents = results[0].address_components;

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
                          dispatch(setSelectedMapHideShow(false));
                          dispatch(setLocation({
                            locationName: item.description,
                            locationDetail: results[0].formatted_address,
                            id: results[0].place_id,
                            lat: location.lat(),
                            lng: location.lng()
                          }))
                        }
                      }
                    );
                  }
                }}
                structured={item.structured_formatting}
                path={path}
                search={search}
              />
            );
          }}
        />
      }
    </div>
  );
};

const styles = {
  header: {
    padding: "0 12px",
    marginBottom: 0,
    fontWeight: 700,
    marginTop: "0px",
    fontSize: "14px",
    lineHeight: "17px",
    color: "#021e4f",
  },
  result: { height: 34, lineHeight: "22px", padding: "6px 16px 6px 8px" },
};

export default MapResults;
