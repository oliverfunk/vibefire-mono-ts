import React, { useCallback, useEffect, useMemo, useRef } from "react";
import MapView, { PROVIDER_GOOGLE, type Region } from "react-native-maps";
import Toast from "react-native-toast-message";
import { useRouter } from "expo-router";
import { useSetAtom } from "jotai";
import { debounce } from "lodash";

import { mapPositionInfoAtom } from "@vibefire/shared-state";

import { defaultCameraForPosition } from "!/utils/constants";
import { useLocationOnce } from "!/hooks/useLocation";
import { useMapDisplayableEvents } from "!/hooks/useMapQuery";

import { HANDLE_HEIGHT } from "!/components/bottom-panel/HandleWithNavigation";
import { EventMapMarker } from "!/components/event/EventMapMarker";
import { eventMapMapRefAtom } from "!/atoms";
import { navViewEvent } from "!/nav";
import { altitudeToZoomLevel } from "!utils/math";

export const GeoQueryMap = () => {
  const mvRef = useRef<MapView>(null);

  const router = useRouter();

  const setEventMapMapRef = useSetAtom(eventMapMapRefAtom);

  const setMapQueryPositionAtomDbc = debounce(
    useSetAtom(mapPositionInfoAtom),
    1000,
  );

  const { location: locationOnce, locPermDeniedMsg } = useLocationOnce();

  //#region effects
  useEffect(() => {
    if (mvRef.current === null) {
      return;
    }
    setEventMapMapRef(mvRef.current);
    if (!locationOnce) {
      return;
    }
    mvRef.current.setCamera(
      defaultCameraForPosition({
        lat: locationOnce.coords.latitude,
        lng: locationOnce.coords.longitude,
      }),
    );
  }, [locationOnce, setEventMapMapRef]);

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
      const bbox = mvRef.current?.boundingBoxForRegion(region);
      if (bbox === undefined) {
        return;
      }

      const cam = await mvRef.current?.getCamera();
      let _queryZoomLevel = cam?.zoom;
      if (_queryZoomLevel === undefined) {
        _queryZoomLevel = cam?.altitude;
        if (_queryZoomLevel === undefined) {
          return;
        }
        _queryZoomLevel = altitudeToZoomLevel(_queryZoomLevel);
      }

      setMapQueryPositionAtomDbc({
        northEast: {
          lat: bbox.northEast.latitude,
          lng: bbox.northEast.longitude,
        },
        southWest: {
          lat: bbox.southWest.latitude,
          lng: bbox.southWest.longitude,
        },
        zoomLevel: _queryZoomLevel,
      });
    },
    [setMapQueryPositionAtomDbc],
  );

  const displayEvents = useMapDisplayableEvents();
  const displayEventMarkers = useMemo(() => {
    return displayEvents.map((event) => (
      <EventMapMarker
        key={event.id}
        eventId={event.id}
        markerPosition={event.location.position}
        vibeRating={event.map.vibe ?? 0}
        onPress={() => {
          navViewEvent(router, event.id);
          mvRef.current?.animateCamera({
            center: {
              latitude: event.location.position.lat,
              longitude: event.location.position.lng,
            },
          });
        }}
      />
    ));
  }, [displayEvents, router]);

  return (
    <MapView
      ref={mvRef}
      className="h-full w-full"
      initialCamera={
        locationOnce
          ? defaultCameraForPosition({
              lat: locationOnce.coords.latitude,
              lng: locationOnce.coords.longitude,
            })
          : undefined
      }
      mapPadding={{
        top: HANDLE_HEIGHT,
        right: 0,
        bottom: HANDLE_HEIGHT,
        left: 0,
      }}
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      showsMyLocationButton={false}
      pitchEnabled={false}
      zoomControlEnabled={false}
      toolbarEnabled={false}
      loadingEnabled={true}
      onRegionChangeComplete={onMapRegionChange}
      moveOnMarkerPress={false}
      rotateEnabled={false}
      onMapLoaded={() => {}}
      // cameraZoomRange={{}}
      maxZoomLevel={20}
      minZoomLevel={3}
    >
      {displayEventMarkers}
    </MapView>
  );
};
