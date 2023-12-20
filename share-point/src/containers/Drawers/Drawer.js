import React from "react";
import { useDispatch } from "react-redux";
import _ from "lodash";

const reverse = {
  left: "right",
  right: "left",
};

const boxShadows = {
  left: "2px 0 8px rgba(0, 0, 0, 0.15)",
  right: "-2px 0 8px rgba(0, 0, 0, 0.15)",
};

const zIndexes = {
  left: 1,
  right: 0,
};

const Drawer = ({
                  direction,
                  path,
                  page,
                  width,
                  defaultWidth,
                  space = 0,
                  children,
                }) => {
  const reversed = reverse[direction];
  const isOpen = !!path;
  const Content = page && page.content;
  const safeWidth = width || _.get(page, "defaultWidth", defaultWidth);
  const containerStyles = {
    ...styles.container,
    width: path === "" ? 0 : styles.container.width,
  };

  return (
      <div style={containerStyles}>
        {Content && <Content width={safeWidth} />}
        {children}
      </div>
  );
};

const styles = {
  container: {
    position: "fixed",
    userSelect: "auto",
    top: 0,
    backgroundColor: "#fafafc",
    transition: "right 0.3s cubic-bezier(0.7, 0.3, 0.1, 1) 0s",
    left: 0,
    boxShadow: "rgb(0 0 0 / 15%) -2px 0px 8px",
    zIndex: 0,
    width: 400,
    boxSizing: "border-box",
    flexShrink: 0,
    height: "100%",
  },
  bottomContainer: {
    backgroundColor: "#0087B7",
    height: "11%",
    color: "white",
  },
};

export default Drawer;
