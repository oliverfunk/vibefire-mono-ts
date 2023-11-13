import { type VibefireEventT } from "@vibefire/models";

export const eventUrl = (event: VibefireEventT) => {
  return `https://vifr.io/e/${event.linkId}`;
};
