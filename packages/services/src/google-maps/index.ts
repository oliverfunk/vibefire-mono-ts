import { AddressType, Client } from "@googlemaps/google-maps-services-js";
import fetchAdapter from "@vespaiach/axios-fetch-adapter";
import axios from "axios";

export { Status } from "@googlemaps/google-maps-services-js";

export type GoogleMapsClient = {
  client: Client;
  apiKey: string;
};

export const googleMapsFetchClient = (
  apiKey: string,
  timeout = 500,
): GoogleMapsClient => {
  const axiosInstance = axios.create({
    timeout,
    adapter: fetchAdapter,
  });
  return { client: new Client({ axiosInstance }), apiKey };
};

export const googleMapsClient = (
  apiKey: string,
  timeout = 500,
): GoogleMapsClient => {
  return { client: new Client({ config: { timeout } }), apiKey };
};

export const getTimezoneInfo = async (
  client: GoogleMapsClient,
  params: {
    lat: number;
    lng: number;
    timestampSeconds: number;
  },
) => {
  const res = await client.client.timezone({
    params: {
      key: client.apiKey,
      location: [params.lat, params.lng],
      timestamp: params.timestampSeconds,
    },
  });
  return res.data;
};

export const getPositionInfo = async (
  client: GoogleMapsClient,
  params: { lat: number; lng: number },
) => {
  const res = await client.client.reverseGeocode({
    params: {
      key: client.apiKey,
      latlng: [params.lat, params.lng],
    },
  });
  return res.data;
};

export const getPositionStreetAddress = async (
  client: GoogleMapsClient,
  params: { lat: number; lng: number },
) => {
  const res = await client.client.reverseGeocode({
    params: {
      key: client.apiKey,
      latlng: [params.lat, params.lng],
      result_type: [AddressType.street_address],
    },
  });
  return res.data;
};
