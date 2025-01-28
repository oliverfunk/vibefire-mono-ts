import React, { useEffect, useRef, useState } from "react";
import MapView, { PROVIDER_GOOGLE } from "react-native-maps";

import { type CoordT } from "@vibefire/models";
import { isCoordZeroZero } from "@vibefire/utils";

import { defaultCameraForPosition } from "!/utils/constants";
import { trpc } from "!/api/trpc-client";
import { useUserLocationWithMapCameraSetter } from "!/hooks/useMapCameraUserLocationSetter";

import { EventMapMarker } from "!/c/event/EventMapMarker";

export const LocationSelectionMap = (props: {
  eventId: string;
  initialPosition?: CoordT;
  onPositionSelected?: (position: CoordT) => void;
  onAddressDescription?: (addressDescription: string) => void;
  onPress?: () => void;
}) => {
  const {
    eventId,
    initialPosition,
    onPositionSelected,
    onAddressDescription,
    onPress,
  } = props;

  const mvRef = useRef<MapView>(null);

  const userLocationOnce = useUserLocationWithMapCameraSetter(
    mvRef,
    initialPosition,
  );

  const [selectedPosition, setSelectedPosition] = useState<CoordT | undefined>(
    initialPosition,
  );

  const positionAddressInfoMut =
    trpc.services.positionAddressInfo.useMutation();
  useEffect(() => {
    if (!onAddressDescription) {
      return;
    }
    if (!selectedPosition) {
      return;
    }
    if (selectedPosition === initialPosition) {
      return;
    }
    positionAddressInfoMut
      .mutateAsync({
        position: selectedPosition,
      })
      .then((res) => {
        if (!res.ok) {
          console.log("could not get address description");
          return;
        }
        onAddressDescription(res.value);
      })
      .catch((err) => {
        console.log(JSON.stringify(err, null, 2));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPosition]);

  return (
    <MapView
      ref={mvRef}
      className="h-full w-full"
      provider={PROVIDER_GOOGLE}
      initialCamera={
        userLocationOnce
          ? defaultCameraForPosition({
              lat: userLocationOnce.coords.latitude,
              lng: userLocationOnce.coords.longitude,
            })
          : undefined
      }
      // trying to get two finger zooming to work on android :(
      onStartShouldSetResponderCapture={() => true}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => true}
      onMoveShouldSetResponderCapture={() => true}
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
      {selectedPosition && !isCoordZeroZero(selectedPosition) && (
        <EventMapMarker
          eventId={eventId}
          markerPosition={selectedPosition}
          vibeRating={0}
        />
      )}
    </MapView>
  );
};
