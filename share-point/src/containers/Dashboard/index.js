import React from "react";
import Map from "../Map";
import Drawers from "../Drawers";
import PageHeaders from "../PageHeader";

const Dashboard = () => {
  return (
    <div style={styles.container}>
      <PageHeaders/>
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
