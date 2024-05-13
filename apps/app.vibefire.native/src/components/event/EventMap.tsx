import React, { useCallback, useEffect, useRef, useState } from "react";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";
import Toast from "react-native-toast-message";
import { useSetAtom } from "jotai";
import { debounce } from "lodash";

import { mapPositionInfoAtom } from "@vibefire/shared-state";

import { useLocationOnce } from "!/hooks/useLocation";
import { useDisplayEvents } from "!/hooks/useMapQuery";

import { eventMapMapRefAtom } from "!/atoms";
import { SEARCH_HANDLE_HEIGHT } from "!/c/bottom-panel/BottomPanelHandle";
import { EventIcon } from "!/c/SvgIcon";
import { navViewEvent } from "!/nav";

const EventMapComponent = () => {
  const mvRef = useRef<MapView>(null);
  const [mapReady, setMapReady] = useState(false);

  const setEventMapMapRef = useSetAtom(eventMapMapRefAtom);

  const setMapQueryPositionAtomDbc = debounce(
    useSetAtom(mapPositionInfoAtom),
    1000,
  );

  const { location, locPermDeniedMsg } = useLocationOnce();

  //#region effects
  useEffect(() => {
    if (!mapReady) {
      return;
    }
    if (mvRef.current === null) {
      return;
    }
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
  }, [location, mapReady]);

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
      const _zoomLevel = (await mvRef.current?.getCamera())?.zoom;
      if (_bbox === undefined) {
        return;
      }
      if (_zoomLevel === undefined) {
        return;
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

  const [bottomPanelHeight] = useState(() => {
    return SEARCH_HANDLE_HEIGHT * 1;
  });

  const displayEvents = useDisplayEvents();

  return (
    <MapView
      ref={mvRef}
      onMapReady={() => {
        setMapReady(true);
        setEventMapMapRef(mvRef.current);
      }}
      className="h-full w-full"
      mapPadding={{
        top: bottomPanelHeight,
        right: 0,
        bottom: bottomPanelHeight,
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
              navViewEvent(event.linkId);
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
            <EventIcon vibeIndex={event.vibe} />
          </Marker>
        ))}
    </MapView>
  );
};

export const EventMap = () => {
  return <EventMapComponent />;
};
