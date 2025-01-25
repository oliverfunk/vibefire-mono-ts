export const zoomLevelToAltitude = (zoomLevel: number): number => {
  const earthCircumference = 40075000; // Earth's circumference in meters
  const altitude = earthCircumference / Math.pow(2, zoomLevel);
  return altitude;
};

export const altitudeToZoomLevel = (altitude: number): number => {
  const earthCircumference = 40075000; // Earth's circumference in meters
  const zoomLevel = Math.round(Math.log2(earthCircumference / altitude));
  return Math.max(0, Math.min(zoomLevel, 21));
};
