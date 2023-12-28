import { type VibefireEventT } from "@vibefire/models";

const encodeQueryParameters = (params: { [key: string]: string }) => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
};

export const vibefireEventShareURL = (linkId: string) => {
  return `https://vifr.io/event/${linkId}`;
};

export const vibefireEventShareLocalURL = (linkId: string) => {
  return `vifr:///event/${linkId}`;
};

export const uberClientRequestToEventLocationURL = (
  uberClientID: string,
  event: VibefireEventT,
) => {
  const { lat, lng } = event.location.position;
  const { addressDescription } = event.location;
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

export const googleMapsOpenEventLocationURL = (event: VibefireEventT) => {
  const { lat, lng } = event.location.position;
  const { addressDescription } = event.location;
  const queryParams = encodeQueryParameters({
    api: "1",
    query: `${lat},${lng}`,
  });
  const url = `https://www.google.com/maps/search/?${queryParams}`;
  return url;
};

export const appleMapsOpenEventLocationURL = (event: VibefireEventT) => {
  const { lat, lng } = event.location.position;
  const { addressDescription } = event.location;
  const queryParams = encodeQueryParameters({
    ll: `${lat},${lng}`,
    q: `${addressDescription}`,
  });
  const url = `http://maps.apple.com/?${queryParams}`;
  return url;
};
