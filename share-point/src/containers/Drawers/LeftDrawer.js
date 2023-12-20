import React from "react";

import Drawer from "./Drawer";


import { left } from "./drawers";

const { pages, defaultWidth } = left;

const LeftDrawer = ({ path, width }) => {
  const page = pages.Layers;
  console.log('page-----------------------------', page)
  return (
    <Drawer
      direction="left"
      path={path}
      page={page}
      width={width}
      defaultWidth={defaultWidth}
      draggable
    >
    </Drawer>
  );
};

export default LeftDrawer;
