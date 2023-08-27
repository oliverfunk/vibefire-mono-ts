import { Client } from "@googlemaps/google-maps-services-js";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import axios from "axios";

const axiosInstance = axios.create({
  timeout: 500,
  adapter: fetchAdapter,
});
const googleMapsClient = new Client({ axiosInstance });

export const getTimezoneID = async (
  lat: number,
  lng: number,
  timestampSeconds: number,
) => {
  const res = await googleMapsClient.timezone({
    params: {
      location: { lat, lng },
      timestamp: timestampSeconds,
      key: "***REMOVED***",
    },
  });
  return res.data.timeZoneId;
};
