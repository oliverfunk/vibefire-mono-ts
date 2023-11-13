import { type VibefireEventT } from "@vibefire/models";

const encodeQueryParameters = (params: { [key: string]: string }) => {
  return Object.entries(params)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
    )
    .join("&");
};

export const vibefireEventShareURL = (event: VibefireEventT) => {
  return `https://vifr.io/e/${event.linkId}`;
};

export const uberRequestToEventURL = (
  uberClientID: string,
  event: VibefireEventT,
) => {
  const { lat, lng } = event.location.position;
  const { addressDescription } = event.location;
  const query = encodeQueryParameters({
    client_id: uberClientID,
    action: "setPickup",
    pickup: "my_location",
    "dropoff[latitude]": lat.toString(),
    "dropoff[longitude]": lng.toString(),
    "dropoff[nickname]": addressDescription,
  });
  const url = `https://m.uber.com/ul/?${query}`;
  return url;
};
