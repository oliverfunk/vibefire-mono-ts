import { type CoordT } from "@vibefire/models";
import {
  getPositionStreetAddress,
  getTimezoneInfo,
  googleMapsFetchClient,
  Status,
  type GoogleMapsClient,
} from "@vibefire/services/g-maps";

export class GoogleMapsManager {
  private googleMapsClient: GoogleMapsClient;
  constructor(googleMapsApiKey: string) {
    this.googleMapsClient = googleMapsFetchClient(googleMapsApiKey);
  }

  async getTimeZoneInfoFromPosition(
    position: CoordT,
    timestampSeconds: number,
  ): Promise<string> {
    const res = await getTimezoneInfo(this.googleMapsClient, {
      lat: position.lat,
      lng: position.lng,
      timestampSeconds,
    });
    if (res.status !== Status.OK) {
      // todo: is there a better way?
      throw new Error("Failed to get timezone info");
    }
    return res.timeZoneId;
  }

  async getBestStreetAddressFromPosition(position: CoordT): Promise<string> {
    const res = await getPositionStreetAddress(this.googleMapsClient, {
      lat: position.lat,
      lng: position.lng,
    });
    if (res.status !== Status.OK) {
      console.error(JSON.stringify(res, null, 2));
      return "";
    }
    if (res.results.length === 0) {
      return "";
    }
    return res.results[0]?.formatted_address ?? "";
  }
}
