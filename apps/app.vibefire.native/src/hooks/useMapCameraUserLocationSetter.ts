import { RefObject, useEffect } from "react";
import { useWindowDimensions } from "react-native";
import MapView from "react-native-maps";
import Toast from "react-native-toast-message";

import { CoordT } from "@vibefire/models";
import { isCoordZeroZero } from "@vibefire/utils";

import { defaultCameraForPosition } from "!/utils/constants";

import { useLocationOnce } from "./useLocation";

export const useUserLocationWithMapCameraSetter = (
  mapRef: RefObject<MapView>,
  initialPosition?: CoordT,
) => {
  const { location: locationOnce, locPermDeniedMsg } = useLocationOnce();
  const { height } = useWindowDimensions();

  useEffect(() => {
    if (mapRef.current === null) {
      return;
    }
    if (initialPosition && !isCoordZeroZero(initialPosition)) {
      mapRef.current.setCamera(defaultCameraForPosition(initialPosition));
      return;
    }
    if (locPermDeniedMsg) {
      Toast.show({
        type: "error",
        text1: "Could not get your location",
        text2: locPermDeniedMsg,
        position: "top",
        topOffset: height / 10,
        visibilityTime: 2000,
      });
    }
    if (!locationOnce) {
      return;
    }
    mapRef.current.setCamera(
      defaultCameraForPosition({
        lat: locationOnce.coords.latitude,
        lng: locationOnce.coords.longitude,
      }),
    );
  }, [initialPosition, locationOnce]);

  return locationOnce;
};
