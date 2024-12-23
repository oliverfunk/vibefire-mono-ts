import { type TModelVibefireEvent } from "@vibefire/models";

const encodeQueryParameters = (params: { [key: string]: string }) => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
};

export const vibefireEventShareURL = (
  eventId: string,
  memberShareCode?: string,
  asLocal: boolean = false,
) => {
  const queryParams = new URLSearchParams({
    e: eventId,
  });
  if (memberShareCode) {
    queryParams.append("s", memberShareCode);
  }
  if (asLocal) {
    return `vifr:///?${queryParams.toString()}`;
  }
  return `https://vifr.io/?${queryParams.toString()}`;
};

export const uberClientRequestToEventLocationURL = (
  uberClientID: string,
  location: TModelVibefireEvent["location"],
) => {
  const { lat, lng } = location.position;
  const { addressDescription } = location;
  const queryParams = new URLSearchParams({
    client_id: uberClientID,
    action: "setPickup",
    pickup: "my_location",
    "dropoff[latitude]": lat.toString(),
    "dropoff[longitude]": lng.toString(),
    "dropoff[nickname]": addressDescription,
  }).toString();
  const url = `https://m.uber.com/ul/?${queryParams}`;
  return url;
};

export const googleMapsOpenEventLocationURL = (
  location: TModelVibefireEvent["location"],
) => {
  const { lat, lng } = location.position;
  const queryParams = encodeQueryParameters({
    api: "1",
    query: `${lat},${lng}`,
  });
  const url = `https://www.google.com/maps/search/?${queryParams}`;
  return url;
};

export const appleMapsOpenEventLocationURL = (
  location: TModelVibefireEvent["location"],
) => {
  const { lat, lng } = location.position;
  const { addressDescription } = location;
  const queryParams = encodeQueryParameters({
    ll: `${lat},${lng}`,
    q: `${addressDescription}`,
  });
  const url = `http://maps.apple.com/?${queryParams}`;
  return url;
};
