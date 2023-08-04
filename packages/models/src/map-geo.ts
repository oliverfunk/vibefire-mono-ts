export type Coord = {
  lat: number;
  lng: number;
};

export type MapPositionInfo = {
  northEast: Coord;
  southWest: Coord;
  zoomLevel: number;
};

export type MapQueryInfo = {
  numberOfEvents: number;
  queryStatus: "loading" | "done";
};
