import React, { useRef } from "react";
import { View } from "react-native";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { type CoordT } from "@vibefire/models";

import { defaultCameraForPosition } from "!/utils/constants";

import { EventIcon } from "!/c/SvgIcon";

export const LocationDisplayMap = (props: { markerPosition: CoordT }) => {
  const { markerPosition } = props;

  const mvRef = useRef<MapView>(null);

  return (
    <View pointerEvents="none">
      <MapView
        ref={mvRef}
        className="h-full w-full"
        initialCamera={defaultCameraForPosition(markerPosition)}
        // provider={PROVIDER_GOOGLE}
        pointerEvents={"none"}
        zoomEnabled={false}
        loadingEnabled={true}
        scrollEnabled={false}
        zoomTapEnabled={false}
        showsMyLocationButton={false}
        zoomControlEnabled={false}
        pitchEnabled={false}
        toolbarEnabled={false}
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
    </View>
  );
};
