import {
  AddressType,
  Client,
  Status,
} from "@googlemaps/google-maps-services-js";
import axios from "axios";

import { type CoordT } from "@vibefire/models";
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
        // intended
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

  async getTimezoneInfo(
    position: CoordT,
    timestampSeconds: number,
  ): Promise<{ timeZoneId?: string; rawOffset?: number; dstOffset?: number }> {
    const res = await this.client.timezone({
      params: {
        key: this.apiKey,
        location: [position.lat, position.lng],
        timestamp: timestampSeconds,
      },
    });
    const { data } = res;
    if (data.status === Status.ZERO_RESULTS) {
      return {};
    }
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

  async getPositionStreetAddress(params: { lat: number; lng: number }) {
    const res = await this.client.reverseGeocode({
      params: {
        key: this.apiKey,
        latlng: [params.lat, params.lng],
        result_type: [
          AddressType.street_address,
          AddressType.route,
          AddressType.intersection,
          AddressType.political,
          AddressType.country,
        ],
      },
    });
    const { data } = res;
    if (data.status === Status.ZERO_RESULTS) {
      return "";
    }
    if (data.status !== Status.OK) {
      throw new Error(
        `Failed to get timezone info: ${data.status}\n${data.error_message}`,
      );
    }

    // this really should go into a manger
    const addressComponents = data.results[0]?.address_components
      .slice(0, 3)
      .map((component) => component.long_name)
      .join(" ");
    return addressComponents ?? "";
  }
}
