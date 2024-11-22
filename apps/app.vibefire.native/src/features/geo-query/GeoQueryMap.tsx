import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { debounce } from "lodash";

import { mapPositionInfoAtom } from "@vibefire/shared-state";

import { useLocationOnce } from "!/hooks/useLocation";
import { useMapDisplayableEvents } from "!/hooks/useMapQuery";

import { HANDLE_HEIGHT } from "!/components/bottom-panel/HandleWithNavigation";
import { eventMapMapRefAtom } from "!/atoms";
import { EventIcon } from "!/c/SvgIcon";
import { navViewEvent } from "!/nav";

const INITIAL_ZOOM_LEVEL = 16;

const altitudeToZoomLevel = (altitude: number): number => {
  const earthCircumference = 40075000; // Earth's circumference in meters
  const zoomLevel = Math.round(Math.log2(earthCircumference / altitude));
  return Math.max(0, Math.min(zoomLevel, 21));
};

export const GeoQueryMap = () => {
  const mvRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  const router = useRouter();

  const setEventMapMapRef = useSetAtom(eventMapMapRefAtom);

  const setMapQueryPositionAtomDbc = debounce(
    useSetAtom(mapPositionInfoAtom),
    1000,
  );

  const { location: locationOnce, locPermDeniedMsg } = useLocationOnce();

  //#region effects
  useEffect(() => {
    if (!mapReady) {
      return;
    }
    if (mvRef.current === null) {
      return;
    }
    if (!locationOnce) {
      return;
    }
    mvRef.current.setCamera({
      center: {
        latitude: locationOnce.coords.latitude,
        longitude: locationOnce.coords.longitude,
      },
      zoom: INITIAL_ZOOM_LEVEL,
    });
  }, [locationOnce, mapReady]);

  useEffect(() => {
    if (locPermDeniedMsg) {
      Toast.show({
        type: "error",
        text1: "Could not get your location",
        text2: locPermDeniedMsg,
        position: "bottom",
        bottomOffset: 100,
      });
    }
  }, [locPermDeniedMsg]);
  //#endregion

  const onMapRegionChange = useCallback(
    async (region: Region) => {
      const _bbox = mvRef.current?.boundingBoxForRegion(region);
      if (_bbox === undefined) {
        return;
      }

      const cam = await mvRef.current?.getCamera();
      let _zoomLevel = cam?.zoom;
      if (_zoomLevel === undefined) {
        _zoomLevel = cam?.altitude;
        if (_zoomLevel === undefined) {
          return;
        }
        _zoomLevel = altitudeToZoomLevel(_zoomLevel);
      }

      setMapQueryPositionAtomDbc({
        northEast: {
          lat: _bbox.northEast.latitude,
          lng: _bbox.northEast.longitude,
        },
        southWest: {
          lat: _bbox.southWest.latitude,
          lng: _bbox.southWest.longitude,
        },
        zoomLevel: _zoomLevel,
      });
    },
    [setMapQueryPositionAtomDbc],
  );

  const displayEvents = useMapDisplayableEvents();

  return (
    <MapView
      ref={mvRef}
      initialCamera={{
        zoom: INITIAL_ZOOM_LEVEL,
        center: {
          latitude: 0,
          longitude: 0,
        },
        heading: 0,
        pitch: 0,
      }}
      onMapReady={() => {
        setMapReady(true);
        setEventMapMapRef(mvRef.current);
      }}
      className="h-full w-full"
      mapPadding={{
        top: HANDLE_HEIGHT,
        right: 0,
        bottom: HANDLE_HEIGHT,
        left: 0,
      }}
      // provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={false}
      pitchEnabled={false}
      zoomControlEnabled={false}
      toolbarEnabled={false}
      loadingEnabled={true}
      onRegionChangeComplete={onMapRegionChange}
      moveOnMarkerPress={false}
      rotateEnabled={false}
      //   cameraZoomRange={{}}
      maxZoomLevel={20}
      minZoomLevel={3}
    >
      {displayEvents.length > 0 &&
        displayEvents.map((event, _index) => (
          <Marker
            key={event.id}
            coordinate={{
              latitude: event.location.position.lat,
              longitude: event.location.position.lng,
            }}
            anchor={{ x: 0.5, y: 1 }} // bottom center
            onPress={() => {
              navViewEvent(router, event.linkId);
              mvRef.current?.animateCamera({
                center: {
                  latitude: event.location.position.lat,
                  longitude: event.location.position.lng,
                },
              });
            }}
          >
            {/* <Callout
                tooltip={true}
                onPress={() => {
                  navViewEvent(event.id);
                }}
              >
                <View className="h-28 w-56 rounded-md bg-black p-2">
                  <View className="h-full w-full bg-white" />
                </View>
              </Callout> */}
            <EventIcon vibeIndex={event.map.vibe} />
          </Marker>
        ))}
    </MapView>
  );
};
