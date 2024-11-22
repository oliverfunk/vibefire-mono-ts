import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";

import { type CoordT } from "@vibefire/models";

import { trpc } from "!/api/trpc-client";
import { useLocationOnce } from "!/hooks/useLocation";

export const LocationSelectionMap = (props: {
  initialPosition?: CoordT;
  onPositionSelected?: (position: CoordT) => void;
  onAddressDescription?: (addressDescription: string) => void;
  onPress?: () => void;
}) => {
  const { initialPosition, onPositionSelected, onAddressDescription, onPress } =
    props;

  const mvRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  const [selectedPosition, setSelectedPosition] = useState<CoordT | undefined>(
    initialPosition,
  );

  const { location, locPermDeniedMsg } = useLocationOnce();
  useEffect(() => {
    if (!mapReady) {
      return;
    }

    if (mvRef.current === null) {
      return;
    }

    if (initialPosition) {
      mvRef.current.setCamera({
        center: {
          latitude: initialPosition.lat,
          longitude: initialPosition.lng,
        },
        zoom: 16,
      });
    } else {
      if (!location) {
        return;
      }
      mvRef.current.setCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 16,
      });
    }
  }, [initialPosition, location, mapReady]);

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
          console.error(JSON.stringify(res.error, null, 2));
          return;
        }
        onAddressDescription(res.value);
      })
      .catch((err) => {
        console.error(JSON.stringify(err, null, 2));
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPosition]);

  return (
    <MapView
      ref={mvRef}
      className="h-full w-full"
      // provider={PROVIDER_GOOGLE}
      onMapReady={() => {
        setMapReady(true);
      }}
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
