import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Typography, List } from "antd";
import "../../App.css";

import SearchResult from "../../components/SearchResult";

import {setLayer, setLocation} from "../../store";

const { Title } = Typography;
const locale = { emptyText: "No Results" };

const MapResults = ({ path, search }) => {
  const mapLoading = useSelector((state) => state.mapLoading);
  const mapResults = useSelector((state) => state.mapResults);
  const input = useSelector((state) => state.search);
  const tot = useSelector((state) => state);
  const dispatch = useDispatch();

  console.log('tot-------------------------------------', tot)
  return (
    <div className="sitewise-skeleton-search">
      <Title level={4} style={styles.header}>
        Address / Locations Found
      </Title>

      {
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
                    console.log('locationName-------------', locationName)
                    const geocoder = new window.google.maps.Geocoder();
                    geocoder.geocode(
                      { address: locationName },
                      (results, status) => {
                        if (status === "OK" && results.length > 0) {
                          console.log('results--------------------------', results)
                          const location = results[0].geometry.location;
                          console.log('location--------------------------', location)
                          console.log('bounds--------------------------', results[0].geometry.bounds)
                          dispatch(setLocation({locationName: locationName, locationDetail: results[0].formatted_address, id: results[0].place_id, lat: location.lat(), lng: location.lng()}))
                          // dispatch(
                          //   setLayer("center", {
                          //     lat: location.lat(),
                          //     lng: location.lng(),
                          //   })
                          // );
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
