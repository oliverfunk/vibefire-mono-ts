import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { type CoordT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { useSetMapCameraMarkerPositionElseUserLocation } from "~/hooks/useSetMapCameraMarkerPositionElseUserLocation";

export const LocationSelectionMap = (props: {
  initialPosition?: CoordT;
  onPositionSelected?: (position: CoordT) => void;
  onPositionInfo?: (position: CoordT, addressDescription: string) => void;
  onPress?: () => void;
}) => {
  const { initialPosition, onPositionInfo, onPositionSelected, onPress } =
    props;

  const mvRef = useRef<MapView>(null);

  const [selectedPosition, setSelectedPosition] = useState<CoordT | undefined>(
    initialPosition,
  );

  const positionAddressInfoMut = trpc.events.positionAddressInfo.useMutation();

  useEffect(() => {
    if (!selectedPosition) {
      return;
    }
    if (selectedPosition === initialPosition) {
      return;
    }
    const q = async () => {
      const addressDesc = await positionAddressInfoMut.mutateAsync({
        position: selectedPosition,
      });
      onPositionInfo?.(selectedPosition, addressDesc);
    };
    void q();
  }, [selectedPosition]);

  useSetMapCameraMarkerPositionElseUserLocation(mvRef, selectedPosition);

  return (
    <MapView
      ref={mvRef}
      className="h-full w-full"
      provider={PROVIDER_GOOGLE}
      zoomControlEnabled={false}
      pitchEnabled={false}
      toolbarEnabled={false}
      loadingEnabled={true}
      showsUserLocation={true}
      moveOnMarkerPress={false}
      rotateEnabled={false}
      maxZoomLevel={20}
      minZoomLevel={3}
      onPress={
        onPress
          ? onPress
          : (event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              setSelectedPosition({
                lat: latitude,
                lng: longitude,
              });
              onPositionSelected?.({
                lat: latitude,
                lng: longitude,
              });
            }
      }
      onPoiClick={
        onPress
          ? onPress
          : (event) => {
              const { latitude, longitude } = event.nativeEvent.coordinate;
              setSelectedPosition({
                lat: latitude,
                lng: longitude,
              });
              onPositionSelected?.({
                lat: latitude,
                lng: longitude,
              });
            }
      }
    >
      {selectedPosition && (
        <Marker
          coordinate={{
            latitude: selectedPosition.lat,
            longitude: selectedPosition.lng,
          }}
        />
      )}
    </MapView>
  );
};
