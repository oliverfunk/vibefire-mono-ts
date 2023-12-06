import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Touchable, TouchableOpacity, View } from "react-native";
import MapView, {
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";
import Toast from "react-native-toast-message";
import { ErrorBoundary, type ErrorBoundaryProps } from "expo-router";
import { useSetAtom } from "jotai";

import { type CoordT } from "@vibefire/models";
import { mapPositionInfoAtom } from "@vibefire/shared-state";

import { debounce } from "~/utils/debounce";
import { EventIcon } from "~/components/SvgIcon";
import { eventMapMapRefAtom } from "~/atoms";
import { useLocationOnce } from "~/hooks/useLocation";
import { useDisplayEvents } from "~/hooks/useMapQuery";
import { navClearAll, navCreateEvent, navRefresh, navViewEvent } from "~/nav";
import { SEARCH_HANDLE_HEIGHT } from "../bottom-panel/BottomPanelHandle";

export class Try extends React.Component<
  {
    catch: React.ComponentType<ErrorBoundaryProps>;
    children: React.ReactNode;
  },
  { error?: Error }
> {
  state = { error: undefined };

  static getDerivedStateFromError(error: Error) {
    // Force hide the splash screen if an error occurs.
    // SplashScreen.hideAsync();

    return { error };
  }

  retry = () => {
    return new Promise<void>((resolve) => {
      this.setState({ error: undefined }, () => {
        resolve();
      });
    });
  };

  render() {
    const { error } = this.state;
    const { catch: ErrorBoundary, children } = this.props;
    if (!error) {
      return children;
    }
    return <ErrorBoundary error={error} retry={this.retry} />;
  }
}

const EventMapComponent = (props: { initialMapPosition?: CoordT }) => {
  const mvRef = useRef<MapView>(null);

  const setEventMapMapRef = useSetAtom(eventMapMapRefAtom);

  const setMapQueryPositionAtomDbc = debounce(
    useSetAtom(mapPositionInfoAtom),
    1000,
  );

  const { location, locPermDeniedMsg } = useLocationOnce();

  const displayEvents = useDisplayEvents();

  //#region effects
  useEffect(() => {
    if (location !== null) {
      void mvRef.current?.getCamera().then((camera) => {
        if (camera !== null) {
          mvRef.current?.setCamera({
            center: {
              latitude: location.coords.latitude,
              longitude: location.coords.longitude,
            },
            zoom: 14,
          });
        }
      });
    }

    // const a = mvRef.current;

    // if (a !== null && location !== null) {
    //   void (async () => {
    //     const _camera = await a.getCamera();
    //     a.setCamera({
    //       center: {
    //         latitude: location.coords.latitude,
    //         longitude: location.coords.longitude,
    //       },
    //       zoom: 14,
    //     });
    //   })();
    // }
  }, [location]);

  useEffect(() => {
    if (locPermDeniedMsg !== null) {
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

  return (
    <>
      <MapView
        ref={mvRef}
        onMapReady={() => {
          setEventMapMapRef(mvRef.current);
        }}
        className="h-full w-full"
        mapPadding={{
          top: bottomPanelHeight,
          right: 0,
          bottom: bottomPanelHeight,
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
                navViewEvent(event.id);
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
      {/* <TouchableOpacity
        className="absolute bottom-[100px] right-0 mb-4 mr-4 rounded-full bg-white p-2"
        onPress={() => {
          navCreateEvent();
        }}
      /> */}
    </>
  );
};

export const EventMap = () => {
  return (
    <Try catch={ErrorBoundary}>
      <EventMapComponent />
    </Try>
  );
};
