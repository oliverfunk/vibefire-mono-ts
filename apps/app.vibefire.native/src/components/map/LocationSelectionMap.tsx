import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { type CoordT } from "@vibefire/models";

import { defaultCameraForPosition } from "!/utils/constants";
import { trpc } from "!/api/trpc-client";
import { useLocationOnce } from "!/hooks/useLocation";

import { isCoordZeroZero } from "!utils/general";

export const LocationSelectionMap = (props: {
  initialPosition?: CoordT;
  onPositionSelected?: (position: CoordT) => void;
  onAddressDescription?: (addressDescription: string) => void;
  onPress?: () => void;
}) => {
  const { initialPosition, onPositionSelected, onAddressDescription, onPress } =
    props;

  const mvRef = useRef<MapView>(null);

  const [selectedPosition, setSelectedPosition] = useState<CoordT | undefined>(
    initialPosition,
  );

  const { location: locationOnce, locPermDeniedMsg } = useLocationOnce();

  useEffect(() => {
    if (mvRef.current === null) {
      return;
    }
    if (initialPosition && !isCoordZeroZero(initialPosition)) {
      mvRef.current.setCamera(defaultCameraForPosition(initialPosition));
      return;
    }
    if (!locationOnce) {
      return;
    }
    mvRef.current.setCamera(
      defaultCameraForPosition({
        lat: locationOnce.coords.latitude,
        lng: locationOnce.coords.longitude,
      }),
    );
  }, [initialPosition, locationOnce]);

  // todo: standardise
  // useEffect(() => {
  //   if (locPermDeniedMsg !== null) {
  //     Toast.show({
  //       type: "error",
  //       text1: "Could not get your location",
  //       text2: locPermDeniedMsg,
  //       position: "bottom",
  //       bottomOffset: 100,
  //     });
  //   }
  // }, [locPermDeniedMsg]);

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
      // provider={PROVIDER_GOOGLE}
      initialCamera={
        locationOnce
          ? defaultCameraForPosition({
              lat: locationOnce.coords.latitude,
              lng: locationOnce.coords.longitude,
            })
          : undefined
      }
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
