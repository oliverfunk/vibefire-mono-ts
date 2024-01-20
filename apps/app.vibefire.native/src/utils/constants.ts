import { type CoordT } from "@vibefire/models";

export const defaultCameraForPosition = (position: CoordT) => {
  return {
    center: {
      latitude: position.lat,
      longitude: position.lng,
    },
    zoom: 16,
    heading: 0,
    pitch: 0,
  };
};
