import React from "react";
import { default as AntdIcon } from "@ant-design/icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const Icon = ({ icon, style = {}, theme, twoToneColor, isFAIcon }) => {
  if (isFAIcon) return <FontAwesomeIcon icon={icon} style={style} />;
  const isCustomSvgIcon = typeof icon === "function";
  if (isCustomSvgIcon) {
    return icon();
  }
  const isAntdIcon = typeof icon === "string";
  if (isAntdIcon) {
    return <AntdIcon component={icon} style={style} />;
  }

  return (
    <AntdIcon
      component={icon}
      style={style}
      theme={theme}
      twoToneColor={twoToneColor}
    />
  );
};

export default Icon;
