import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import MapView, {
  Callout,
  Marker,
  PROVIDER_GOOGLE,
  type Region,
} from "react-native-maps";
import Toast from "react-native-toast-message";
import { ErrorBoundary, ErrorBoundaryProps, router } from "expo-router";
import { useSetAtom } from "jotai";

import { CoordT } from "@vibefire/models";
import { mapQueryPositionAtom } from "@vibefire/shared-state";

import { debounce } from "~/utils/debounce";
import { SvgIcon } from "~/components/SvgIcon";
import { useLocationOnce } from "~/hooks/useLocation";
import { useMapQuery } from "~/hooks/useMapQuery";

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
          ...event.location.position,
        })),
      );
    }
  }, [mapQueryState.data]);
  return markers;
};

const EventMapComponent = (props: { initialMapPosition?: CoordT }) => {
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
  }, []);

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
              onPress={() => {
                // router.setParams({ event: `${marker.id}` });
              }}
            >
              <Callout tooltip={true} className="items-center">
                <View className="bg-white">
                  <Text className="text-black">This is amaing</Text>
                </View>
                <View className="h-0 w-0 border-x-[10px] border-b-0 border-t-[15px] border-x-transparent border-t-white" />
              </Callout>
              <SvgIcon idx={index} />
            </Marker>
          ))}
      </MapView>

      <Text className="absolute bottom-[140px] left-2 rounded-md border-2 border-orange-400 bg-black p-2 text-white">
        mapQ: {mapQueryState.status}
      </Text>
    </>
  );
};

const EventMap = () => {
  return (
    <Try catch={ErrorBoundary}>
      <EventMapComponent />
    </Try>
  );
};

export { EventMap };
