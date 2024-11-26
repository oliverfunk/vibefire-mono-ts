import {
  AddressType,
  Client,
  Status,
} from "@googlemaps/google-maps-services-js";
import axios from "axios";

import { resourceLocator } from "@vibefire/utils";

export { Status } from "@googlemaps/google-maps-services-js";

export const googleMapsServiceSymbol = Symbol("googleMapsServiceSymbol");

export const getGoogleMapService = (): GoogleMapsService =>
  resourceLocator().bindResource<GoogleMapsService>(
    googleMapsServiceSymbol,
    (ctx) => {
      const { gooleMaps } = ctx;
      if (!gooleMaps) {
        throw new Error("Google Maps configuration is missing");
      }
      const googleClient = new Client({
        axiosInstance: axios.create({
          adapter: "fetch",
        }),
      });

      return new GoogleMapsService(googleClient, gooleMaps.apiKey);
    },
  );

export class GoogleMapsService {
  constructor(
    private readonly client: Client,
    private readonly apiKey: string,
  ) {}

  async getTimezoneInfo(params: {
    lat: number;
    lng: number;
    timestampSeconds: number;
  }) {
    const res = await this.client.timezone({
      params: {
        key: this.apiKey,
        location: [params.lat, params.lng],
        timestamp: params.timestampSeconds,
      },
    });
    const data = res.data;
    if (data.status !== Status.OK) {
      throw new Error(
        `Failed to get timezone info: ${data.status}\n${data.error_message}`,
      );
    }
    return {
      timeZoneId: data.timeZoneId,
      rawOffset: data.rawOffset,
      dstOffset: data.dstOffset,
    };
  }

  async getPositionInfo(params: { lat: number; lng: number }) {
    const res = await this.client.reverseGeocode({
      params: {
        key: this.apiKey,
        latlng: [params.lat, params.lng],
      },
    });
    return res.data;
  }

  async getPositionStreetAddress(params: { lat: number; lng: number }) {
    const res = await this.client.reverseGeocode({
      params: {
        key: this.apiKey,
        latlng: [params.lat, params.lng],
        result_type: [AddressType.street_address],
      },
    });
    const data = res.data;
    if (data.status === Status.ZERO_RESULTS) {
      return "";
    }
    if (data.status !== Status.OK) {
      throw new Error(
        `Failed to get timezone info: ${data.status}\n${data.error_message}`,
      );
    }
    return data.results[0]?.address_components[0]?.types[0] ?? "";
  }
}
