import React from "react";

// import Toolbar from "./Toolbar";
// import SearchBar from "./SearchBar";

const LeftDrawerContent = ({ title, children, searchProps }) => {

  return (
    <React.Fragment>
      {/*<div>hello world</div>*/}
      {/*<Toolbar*/}
      {/*  // title={title || path}*/}
      {/*  // hideBorder={searchProps && searchProps.searching}*/}
      {/*/>*/}
      {/* {searchProps && (
        <SearchBar
          {...searchProps}
          className="sitewise-drawer-search"
          allowClear
        />
      )} */}
      {children}
    </React.Fragment>
  );
};

export default LeftDrawerContent;
