import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Input } from "antd";
import Icon, { SearchOutlined, CloseOutlined } from "@ant-design/icons";

import MapResults from "./MapResults";

import { setSearchProps, searchLocation } from "../../store";

const path = "input";

const Search = ({backgroundColor}) => {
  const searchRef = useRef();
  const active = true;
  const input = useSelector((state) => state.search);

  const trim = input.trim();
  const dispatch = useDispatch();
  useEffect(() => {
    if (trim) {
      dispatch(searchLocation(trim, path));
    }
  }, [dispatch, trim]);

  const containerStyle = backgroundColor ? {borderColor: backgroundColor, ...styles.container} : {...styles.container}
  return (
    <div className="sitewise-search">
      {active ? (
        <div
          style={containerStyle}
          className={trim ? "sitewise-search-hastext" : ""}
        >
          <Input
            autoFocus
            value={input}
            onChange={(e) => dispatch(setSearchProps("search", e.target.value))}
            // onPressEnter={() => dispatch(pressSearchEnter(path))}
            placeholder="Enter an address or latitude/longitude"
            prefix={<Icon component={SearchOutlined} style={styles.icon} />}
            suffix={
              <Icon
                component={CloseOutlined}
                style={styles.closeIcon}
                onClick={() => dispatch(setSearchProps("search", ""))}
              />
            }
            style={styles.input}
            ref={searchRef}
          />
          <style>
            {`
                    .ant-input-affix-wrapper:focus {
                        border-color: ${backgroundColor ? backgroundColor : '#0087b7'}  !important;
                        box-shadow: inset 0 0 0 1px ${backgroundColor ? backgroundColor : '#0087b7'};
                    }
                    
                    .ant-input-affix-wrapper:hover {
                        border-color: ${backgroundColor ? backgroundColor : '#0087b7'} !important;
                        box-shadow: inset 0 0 0 1px ${backgroundColor ? backgroundColor : '#0087b7'};
                     }
                `}
          </style>
          {trim && (
            <div style={styles.result}>
              <MapResults path={path} search={searchRef} />
            </div>
          )}
        </div>
      ) : (
        'hiii'
      )}
    </div>
  );
};

const styles = {
  container: {
    width: 'auto',
    border: `1px solid #aeb9ca`,
    borderRadius: 4,
    // filter: "drop-shadow(0px 2px 5px rgba(44, 56, 73, 0.15))",
  },
  icon: { color: "#0087B7", fontSize: 16 },
  closeIcon: { color: "#8295AF", fontSize: 16 },
  input: { width: "100%", height: 50 },
  result: {
    padding: "16px 0",
    backgroundColor: "white",
    borderBottomLeftRadius: 4,
    borderBottomRightRadius: 4,
    maxHeight: "calc(100vh - 82px)",
    overflow: "auto",
    boxShadow: "inset 0px 1px 0px #e3e5ed",
    // position: "fixed",
    width: "100%",

  },
};

export default Search;
