import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text } from "react-native";
import MapView, {
  BoundingBox,
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";
import { atom, useAtom } from "jotai";

import { SvgIcon } from "~/components/SvgIcon";
import { trpc } from "~/apis/trpc";

const mapQueryBoxAtom = atom<(BoundingBox & { zoomLevel: number }) | null>(
  null,
);
const mapQueryTimePeriodAtom = atom<string>("20230720/A");

const useMapQuery = () => {
  const [bbox, setBBox] = useAtom(mapQueryBoxAtom);
  const [tp, setTp] = useAtom(mapQueryTimePeriodAtom);
  const a = trpc.events.queryPublicEventsWhenWhere.useQuery(
    bbox === null
      ? {
          timePeriod: "",
          northEast: {
            lat: 0,
            lng: 0,
          },
          southWest: {
            lat: 0,
            lng: 0,
          },
          zoomLevel: 0,
        }
      : {
          timePeriod: tp,
          northEast: {
            lat: bbox.northEast.latitude,
            lng: bbox.northEast.longitude,
          },
          southWest: {
            lat: bbox.southWest.latitude,
            lng: bbox.southWest.longitude,
          },
          zoomLevel: bbox.zoomLevel,
        },
    { enabled: bbox !== null },
  );

  return a;
};

const useMapMarkers = () => {
  const [markers, setMarkers] = useState<{ lat: number; lng: number }[]>([]);
  const mapQueryState = useMapQuery();
  useEffect(() => {
    if (mapQueryState.status === "success") {
      setMarkers(
        [],
        // mapQueryState.data.map((event) => ({
        //   lat: event.location.coord.lat,
        //   lng: event.location.coord.lng,
        // })),
      );
    }
  }, [mapQueryState.data]);
  return markers;
};

const EventMap = () => {
  const mvRef = useRef<MapView>(null);

  const [bbox, setBBox] = useAtom(mapQueryBoxAtom);
  const mapQueryState = useMapQuery();
  const markers = useMapMarkers();
  const addLocEvent = trpc.events.addLocEvent.useMutation();

  const onMapRegionChange = useCallback(async (region: Region) => {
    const _bbox = mvRef.current?.boundingBoxForRegion(region);
    const _zl = (await mvRef.current?.getCamera())?.zoom;
    if (_bbox === undefined) {
      return;
    }
    if (_zl === undefined) {
      return;
    }
    setBBox({ ..._bbox, zoomLevel: _zl });
  }, []);

  return (
    <>
      <MapView
        className="h-full w-full"
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
              key={index}
              coordinate={{ latitude: marker.lat, longitude: marker.lng }}
              title={"marker.title"}
              description={"marker.description"}
            >
              <SvgIcon />
            </Marker>
          ))}
      </MapView>
      <Pressable
        className="absolute bottom-[180px] left-2 rounded-md border-2 border-purple-600 bg-purple-400 p-2"
        onPress={async () => {
          if (bbox === null) {
            return;
          }
          const northEast = {
            lat: bbox!.northEast.latitude,
            lng: bbox!.northEast.longitude,
          };
          const southWest = {
            lat: bbox!.southWest.latitude,
            lng: bbox!.southWest.longitude,
          };
          console.log("about to add loc event");
          try {
            await addLocEvent.mutateAsync({
              eventPosition: {
                lat: (northEast.lat + southWest.lat) / 2,
                lng: (northEast.lng + southWest.lng) / 2,
              },
            });
          } catch (e) {
            console.log("error adding loc event");
            console.log(e);
          }
          console.log("finisehd add loc event");
        }}
      >
        <Text>Add Loc events</Text>
      </Pressable>

      <Text className="absolute bottom-[140px] left-2 rounded-md border-2 border-purple-600 bg-black p-2 text-white">
        mapQ: {mapQueryState.status}
      </Text>
    </>
  );
};
// const wrapped = () => (
//   <ErrorBoundary fallback={<Text>"Error..."</Text>}>
//     <Suspense fallback={<Text>"Loading..."</Text>}>
//       <EventMap />
//     </Suspense>
//   </ErrorBoundary>
// );
export default EventMap;
