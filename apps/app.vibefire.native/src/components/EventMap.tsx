import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";
import Toast from "react-native-toast-message";
import { useSetAtom } from "jotai";

import { Coord } from "@vibefire/models";
import { mapQueryPositionAtom } from "@vibefire/shared-state";

import { debounce } from "~/utils/debounce";
import { SvgIcon } from "~/components/SvgIcon";
import { useLocationOnce } from "~/hooks/useLocation";
import { useMapQuery } from "~/hooks/useMapQuery";

const useMapMarkers = () => {
  const [markers, setMarkers] = useState<
    { id: string; lat: number; lng: number }[]
  >([]);
  const mapQueryState = useMapQuery();
  useEffect(() => {
    if (mapQueryState.status === "success") {
      setMarkers(
        mapQueryState.data.map((event) => ({
          id: event.id,
          lat: event.location.coord.lat,
          lng: event.location.coord.lng,
        })),
      );
    }
  }, [mapQueryState.data]);
  return markers;
};

const EventMapComponent = (props: { initialMapPosition?: Coord }) => {
  const mvRef = useRef<MapView>(null);
  const setBBox = useCallback(
    debounce(useSetAtom(mapQueryPositionAtom), 1000),
    [],
  );

  const { location, locPermDeniedMsg } = useLocationOnce();

  const mapQueryState = useMapQuery();
  const markers = useMapMarkers();

  //#region effects
  useEffect(() => {
    if (location !== null) {
      mvRef.current?.setCamera(
        {
          center: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          },
          zoom: 14,
        },
        // { duration: 1 },
      );
    }
  }, [location]);

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
  //#endregion

  const onMapRegionChange = useCallback(async (region: Region) => {
    const _bbox = mvRef.current?.boundingBoxForRegion(region);
    const _zoomLevel = (await mvRef.current?.getCamera())?.zoom;
    if (_bbox === undefined) {
      return;
    }
    if (_zoomLevel === undefined) {
      return;
    }

    setBBox({
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
  }, []);

  return (
    <>
      <MapView
        className="h-full w-full"
        // initialCamera={{
        //   center: {
        //     latitude: location.coords.latitude,
        //     longitude: location.coords.longitude,
        //   },
        //   zoom: 14,
        // }}
        mapPadding={{ top: 0, right: 0, bottom: 0, left: 0 }}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        onRegionChangeComplete={onMapRegionChange}
        moveOnMarkerPress
        rotateEnabled={false}
        maxZoomLevel={20}
        minZoomLevel={3}
        ref={mvRef}
      >
        {markers.length > 0 &&
          markers.map((marker, index) => (
            <Marker
              key={marker.id}
              coordinate={{ latitude: marker.lat, longitude: marker.lng }}
              title={"marker.title"}
              description={"marker.description"}
            >
              <SvgIcon idx={index} />
            </Marker>
          ))}
      </MapView>

      <Text className="absolute bottom-[140px] left-2 rounded-md border-2 border-purple-600 bg-black p-2 text-white">
        mapQ: {mapQueryState.status}
      </Text>
    </>
  );
};

const EventMap = () => {
  return <EventMapComponent />;
};

// const wrapped = () => (
//   <ErrorBoundary fallback={<Text>"Error..."</Text>}>
//     <Suspense fallback={<Text>"Loading..."</Text>}>
//       <EventMap />
//     </Suspense>
//   </ErrorBoundary>
// );
export { EventMap };
