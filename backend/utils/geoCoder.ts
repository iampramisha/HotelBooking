import NodeGeocoder from "node-geocoder";
import fetch from "node-fetch"; // polyfill fetch

const options = {
  provider: "openstreetmap",
  httpAdapter: "https", // optional
  fetch: fetch,          // pass fetch function
};

const geocoder = NodeGeocoder(options);

export default geocoder;
