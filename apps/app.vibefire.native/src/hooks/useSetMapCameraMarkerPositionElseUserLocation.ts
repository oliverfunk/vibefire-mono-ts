import { useEffect, type RefObject } from "react";
import type MapView from "react-native-maps";
import Toast from "react-native-toast-message";

import { type CoordT } from "@vibefire/models";

import { useLocationOnce } from "~/hooks/useLocation";

export const useSetMapCameraMarkerPositionElseUserLocation = (
  mapRef: RefObject<MapView>,
  markerCoord?: CoordT,
) => {
  const { location, locPermDeniedMsg } = useLocationOnce();

  useEffect(() => {
    if (markerCoord !== undefined) {
      setTimeout(() => {
        mapRef.current?.setCamera({
          center: {
            latitude: markerCoord.lat,
            longitude: markerCoord.lng,
          },
          zoom: 16,
        });
      }, 100);
    } else if (location !== null) {
      setTimeout(() => {
        mapRef.current?.setCamera({
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          zoom: 16,
        });
      }, 100);
    }
  }, [location, mapRef, markerCoord]);

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
};
