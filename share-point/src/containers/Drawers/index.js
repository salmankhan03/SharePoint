import React from "react";
import { useSelector } from "react-redux";

// import LeftDrawer from './LeftDrawer';
import LeftDrawer from "./LeftDrawer";
// import UserDrawer from './UserDrawer';
// import QuestionDrawer from './QuestionDrawer';

const drawerValues = {
  collapsed: true,
  height: 778,
  layout: false,
  mapTypes: false,
  question: undefined,
  left: true,
  widthState: 533,
};

const Drawers = () => {
  const { left, collapsed, widthState } = drawerValues;
  const space = collapsed ? 80 : 216;
  return (
      <div>
        <LeftDrawer path={left} width={widthState} />
      </div>
  );
};

export default Drawers;
