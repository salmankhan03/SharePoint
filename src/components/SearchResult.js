import React from "react";
import { useDispatch } from "react-redux";
import { List } from "antd";

import Skeleton from "./Skeleton";
import Icon from "./Icon";

import { setSearchProps } from "../store";

const highlightText = (text, input, structured) => {
  if (structured) {
    const { main_text, secondary_text } = structured;
    if (main_text && secondary_text) {
      return (
        <span>
          {highlightText(`${main_text},`, input)}
          <span style={styles.secondary}>{secondary_text}</span>
        </span>
      );
    }
  }
  if (!text) {
    return false;
  }
  const parts = text.split(new RegExp(`(${input})`, "gi"));
  return (
    <span>
      {parts.map((part, i) => (
        <span
          key={i}
          style={
            part.toLowerCase() === input.toLowerCase() ? styles.highlight : {}
          }
        >
          {part}
        </span>
      ))}
    </span>
  );
};

const SearchResult = ({
  label,
  input,
  loading,
  onClick,
  structured,
  icon,
  search,
}) => {
  const dispatch = useDispatch();
  const onItemClick = () => {
    onClick();
    dispatch(setSearchProps("search", ""));
    if (search) search.current.focus();
  };
  const escaped = input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const spans = highlightText(label, escaped, structured);
  return (
    <Skeleton loading={loading}>
      <List.Item onClick={onItemClick} style={styles.result}>
        {icon && (
          <Icon icon={icon} style={styles.icon} className={"searchIcon"} />
        )}
        {spans}
      </List.Item>
    </Skeleton>
  );
};

const styles = {
  result: {
    height: 34,
    lineHeight: "22px",
    padding: "6px 16px 6px 32px",
    border: "none",
    justifyContent: "left",
    color: " #021E4F",
  },
  highlight: { color: "#0087B7", fontWeight: 700 },
  secondary: { fontSize: 12, color: "#8295af", marginLeft: 4 },
  icon: { fontSize: 16, marginRight: 8, color: "rgb(0, 135, 183)" },
};

export default SearchResult;
