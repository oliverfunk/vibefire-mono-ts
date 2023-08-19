import { cellToParent, CoordPair, latLngToCell } from "h3-js";

import { CoordT } from "@vibefire/models";

export {
  compactCells,
  latLngToCell,
  polygonToCells,
  cellToParent,
} from "h3-js";

export const hexToDecimal = (hex: string) => parseInt(hex, 16);

const ZOOM_LVL_TO_H3_RES_MAP = {
  5: 1,
  6: 2,
  7: 3,
  8: 3,
  9: 4,
  10: 5,
  11: 6,
  12: 6,
  13: 7,
  14: 7,
  15: 8,
  16: 9,
  17: 9,
  18: 10,
  19: 11,
  20: 11,
  21: 12,
  22: 13,
  23: 14,
  24: 15,
};

export const zoomLevelToH3Resolution = (zoomLevel: number) => {
  const zoomLevelInt = Math.floor(zoomLevel);
  if (zoomLevelInt < 5) {
    return 0;
  }
  if (zoomLevelInt >= 24) {
    return ZOOM_LVL_TO_H3_RES_MAP[24];
  }
  return ZOOM_LVL_TO_H3_RES_MAP[
    zoomLevelInt as keyof typeof ZOOM_LVL_TO_H3_RES_MAP
  ];
};

export const latLngPositionToH3 = (position: CoordT) => {
  const h3 = latLngToCell(position.lat, position.lng, 15);
  const h3Dec = hexToDecimal(h3);

  return {
    h3,
    h3Dec,
  };
};

export const h3ToH3Parents = (
  child: string,
  coarsestRes = 0,
  finestRes = 15,
) => {
  const h3Parents = [];
  for (let i = finestRes; i >= coarsestRes; i--) {
    h3Parents.push(cellToParent(child, i));
  }

  const h3ParentsDec = h3Parents.map((h3) => hexToDecimal(h3));

  return {
    h3Parents,
    h3ParentsDec,
  };
};
