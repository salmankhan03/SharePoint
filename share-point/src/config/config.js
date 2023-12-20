import prodConfig from "./prod.config";

const config = prodConfig;

export default {
  ...config,
  googleMapsApiKey: "AIzaSyDb_hQap88mHAJJFFJ6W8-WqKDeGuvHUm4",
  tileUrlBase: "swp-maps-t",
  BigMapsServer: "https://swp-maps-layout." + config.BigMapsBaseUrl,
  shortcutsWidth: 80,
  shortcutsFullWidth: 216,
  actionBarHeight: 40,
  tableHeaderHeight: 37,
  padding: 48,
  pageHeaderHeight: 55,
};
