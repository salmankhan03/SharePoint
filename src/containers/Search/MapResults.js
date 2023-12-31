import React, {useCallback} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, List } from "antd";
import "../../App.css";

import SearchResult from "../../components/SearchResult";

import {pressSearchPoint, setLayer, setLocation} from "../../store";

const { Title } = Typography;
const locale = { emptyText: "No Results" };

const MapResults = ({ path, search }) => {
  const mapLoading = useSelector((state) => state.mapLoading);
  const mapResults = useSelector((state) => state.mapResults);
  const input = useSelector((state) => state.search);
  const tot = useSelector((state) => state);
  const dispatch = useDispatch();

  const values = input.split(', ');

  const coordinates = {
    lat: parseFloat(values[0]),
    lng: parseFloat(values[1])
  };


  const latitudePattern = /^-?([1-8]?[0-9](\.[0-9]+)?|90(\.0+)?)$/;

  const longitudePattern = /^-?((1[0-7]|[1-9])?[0-9](\.[0-9]+)?|180(\.0+)?)$/;

  const isValidLatitude = latitudePattern.test(parseFloat(values[0]));
  const isValidLongitude = longitudePattern.test(parseFloat(values[1]));

  const drop = useCallback(item => dispatch(pressSearchPoint({path, item})), [path, dispatch]);


  return (
    <div className="sitewise-skeleton-search">
      <Title level={4} style={styles.header}>
        Address / Locations Found
      </Title>

      {(isValidLatitude === true && isValidLongitude  === true) && (
          <div
              onClick={() => drop(coordinates)}
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
                    const locationName = locationTerm.value;
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode(
                      { address: item.description },
                      (results, status) => {
                        if (status === "OK" && results.length > 0) {
                          const location = results[0].geometry.location;
                          dispatch(setLocation({locationName: item.structured_formatting.main_text, locationDetail: results[0].formatted_address, id: results[0].place_id, lat: location.lat(), lng: location.lng()}))
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
