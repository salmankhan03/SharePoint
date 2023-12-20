import React from "react";
import './App.css';
import { Provider } from "react-redux";
import store from "./store";
import Dashboard from "./containers/Dashboard";

function App() {
  return (
      <Provider store={store}>
        <div style={styles.fullscreen}>
          <Dashboard />
        </div>
      </Provider>
  );
}

const styles = {
  fullscreen: {
    height: "100vh",
    background:
        "linear-gradient(202.32deg, #032869 9.68%, rgba(2, 35, 92, 0.71) 61.13%, rgba(2, 30, 79, 0.45) 88.43%)",
  },
};

export default App;
