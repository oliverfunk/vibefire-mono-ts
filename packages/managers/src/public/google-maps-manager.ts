import { type CoordT } from "@vibefire/models";
import {
  getPositionStreetAddress,
  getTimezoneInfo,
  googleMapsFetchClient,
  Status,
  type GoogleMapsClient,
} from "@vibefire/services/g-maps";

import { managersContext } from "~/managers-context";

let _GoogleMapsManager: GoogleMapsManager | undefined;
export const getGoogleMapsManager = (): GoogleMapsManager => {
  "use strict";
  if (!_GoogleMapsManager) {
    const googleMapsApiKey = managersContext().googleMapsApiKey!;
    _GoogleMapsManager = new GoogleMapsManager(googleMapsApiKey);
  }
  return _GoogleMapsManager;
};

export class GoogleMapsManager {
  private googleMapsClient: GoogleMapsClient;
  constructor(googleMapsApiKey: string) {
    this.googleMapsClient = googleMapsFetchClient(googleMapsApiKey);
  }

  async getTimeZoneInfoFromPosition(
    position: CoordT,
    timestampSeconds: number,
  ) {
    const res = await getTimezoneInfo(this.googleMapsClient, {
      lat: position.lat,
      lng: position.lng,
      timestampSeconds,
    });
    if (res.status !== Status.OK) {
      return undefined;
    }
    return res;
  }

  async getTimeZoneFromPosition(position: CoordT, timestampSeconds: number) {
    const res = await this.getTimeZoneInfoFromPosition(
      position,
      timestampSeconds,
    );
    return res?.timeZoneId ?? "UTC";
  }

  async getBestStreetAddressFromPosition(position: CoordT): Promise<string> {
    const res = await getPositionStreetAddress(this.googleMapsClient, {
      lat: position.lat,
      lng: position.lng,
    });
    if (res.status !== Status.OK) {
      return "";
    }
    if (res.results.length === 0) {
      return "";
    }
    return res.results[0]?.formatted_address ?? "";
  }
}
