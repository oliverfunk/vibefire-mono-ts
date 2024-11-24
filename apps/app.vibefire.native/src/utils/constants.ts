import { type Camera } from "react-native-maps";

import { type CoordT } from "@vibefire/models";

import { zoomLevelToAltitude } from "!utils/math";

export const INITIAL_ZOOM_LEVEL = 16;

export const defaultCameraForPosition = (
  position: CoordT,
  zoomLevel?: number,
): Camera => {
  return {
    center: {
      latitude: position.lat,
      longitude: position.lng,
    },
    altitude: zoomLevelToAltitude(zoomLevel ?? INITIAL_ZOOM_LEVEL),
    zoom: zoomLevel ?? INITIAL_ZOOM_LEVEL,
    heading: 0,
    pitch: 0,
  };
};
