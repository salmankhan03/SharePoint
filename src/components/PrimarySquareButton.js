import React from "react";
import { Tooltip } from "antd";

import Icon from "./Icon";

const PrimarySquareButton = ({
  active,
  onClick,
  children,
  icon,
  buttonStyle,
  iconStyle,
  theme = "outlined",
  tooltip,
  tooltipPlacement,
}) => {
  const style = {
    fontSize: 22,
    ...(active ? { color: "#0087B7" } : {}),
    ...iconStyle,
  };
  const placement = tooltipPlacement ? { placement: tooltipPlacement } : {};
  return (
    <Tooltip
      title={tooltip}
      style={tooltip ? {} : { display: "none" }}
      {...placement}
    >
      <div
        className="sitewise-primary-square-button"
        onClick={onClick}
        style={buttonStyle}
      >
        {children}
        {icon && <Icon icon={icon} style={style} theme={theme} />}
      </div>
    </Tooltip>
  );
};

export default PrimarySquareButton;
