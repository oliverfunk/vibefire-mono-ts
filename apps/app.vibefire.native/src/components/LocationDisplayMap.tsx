import React, { useRef } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { type CoordT } from "@vibefire/models";

import { EventIcon } from "./SvgIcon";

export const LocationDisplayMap = (props: { markerPosition: CoordT }) => {
  const { markerPosition } = props;

  const mvRef = useRef<MapView>(null);

  return (
    <MapView
      ref={mvRef}
      className="h-full w-full"
      initialCamera={{
        center: {
          latitude: markerPosition.lat,
          longitude: markerPosition.lng,
        },
        zoom: 16,
        heading: 0,
        pitch: 0,
      }}
      provider={PROVIDER_GOOGLE}
      pointerEvents={"none"}
      zoomEnabled={false}
      scrollEnabled={false}
      zoomTapEnabled={false}
      showsMyLocationButton={false}
      zoomControlEnabled={false}
      pitchEnabled={false}
      toolbarEnabled={false}
      loadingEnabled={true}
      showsUserLocation={true}
      moveOnMarkerPress={false}
      rotateEnabled={false}
      maxZoomLevel={20}
      minZoomLevel={3}
    >
      <Marker
        coordinate={{
          latitude: markerPosition.lat,
          longitude: markerPosition.lng,
        }}
      >
        <EventIcon vibeIndex={0} />
      </Marker>
    </MapView>
  );
};
