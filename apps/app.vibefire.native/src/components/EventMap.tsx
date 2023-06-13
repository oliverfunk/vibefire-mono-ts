import React, { useCallback, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, type Region } from "react-native-maps";

const EventMap = () => {
  const mvRef = useRef<MapView>(null);

  const onMapRegionChange = useCallback(
    (region: Region) =>
      console.log(mvRef.current?.boundingBoxForRegion(region)),
    [],
  );

  return (
    <MapView
      className="h-full w-full"
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      onRegionChangeComplete={onMapRegionChange}
      ref={mvRef}
    />
  );
};
export default EventMap;
