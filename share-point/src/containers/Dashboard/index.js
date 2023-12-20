import React from "react";
import Map from "../Map";
// import PageHeaders from "../PageHeader";
import Drawers from "../Drawers";

// import Shortcuts from "../Shortcuts";
// import Map from "../Map/index";
// import Drawers from "../Drawers";

const Dashboard = () => {
  return (
    <div style={styles.container}>
      {/*<PageHeaders/>*/}
      <Map />
      {/*<Shortcuts />*/}
      <Drawers />
    </div>
  );
};

const styles = {
  container: { height: "100%" },
};

export default Dashboard;
