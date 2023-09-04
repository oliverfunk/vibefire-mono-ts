import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import Toast from "react-native-toast-message";

import { type CoordT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { useLocationOnce } from "~/hooks/useLocation";

export const LocationSelectionMap = (props: {
  currentSelectedPosition?: CoordT;
  onPositionSelected?: (position: CoordT) => void;
  onPositionInfo?: (position: CoordT, addressDescription: string) => void;
}) => {
  const { currentSelectedPosition, onPositionInfo, onPositionSelected } = props;

  const mvRef = useRef<MapView>(null);
  const [selectedPosition, setSelectedPosition] = useState<CoordT | undefined>(
    currentSelectedPosition,
  );
  const positionAddressInfoQuery = trpc.events.positionAddressInfo.useQuery(
    {
      position: selectedPosition ?? { lat: 0, lng: 0 },
    },
    {
      enabled:
        selectedPosition !== undefined ||
        // run only after a selection is made
        currentSelectedPosition !== selectedPosition,
    },
  );

  const { location, locPermDeniedMsg } = useLocationOnce();

  useEffect(() => {
    if (selectedPosition && positionAddressInfoQuery.status == "success") {
      const addressDesc = positionAddressInfoQuery.data;
      onPositionInfo?.(selectedPosition, addressDesc);
    }
  }, [positionAddressInfoQuery.status]);

  useEffect(() => {
    if (currentSelectedPosition !== undefined) {
      mvRef.current?.setCamera({
        center: {
          latitude: currentSelectedPosition.lat,
          longitude: currentSelectedPosition.lng,
        },
        zoom: 16,
      });
    } else if (location !== null) {
      console.log("setting camera to user position");
      mvRef.current?.setCamera({
        center: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        },
        zoom: 16,
      });
    }
  }, [location, currentSelectedPosition]);

  useEffect(() => {
    if (locPermDeniedMsg !== null) {
      Toast.show({
        type: "error",
        text1: "Problem getting your location",
        text2: locPermDeniedMsg,
        position: "bottom",
        bottomOffset: 100,
      });
    }
  }, [locPermDeniedMsg]);

  return (
    <MapView
      ref={mvRef}
      className="h-full w-full"
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      moveOnMarkerPress
      rotateEnabled={false}
      maxZoomLevel={20}
      minZoomLevel={3}
      onPress={(event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedPosition({
          lat: latitude,
          lng: longitude,
        });
      }}
      onPoiClick={(event) => {
        const { latitude, longitude } = event.nativeEvent.coordinate;
        setSelectedPosition({
          lat: latitude,
          lng: longitude,
        });
        onPositionSelected?.({
          lat: latitude,
          lng: longitude,
        });
      }}
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
