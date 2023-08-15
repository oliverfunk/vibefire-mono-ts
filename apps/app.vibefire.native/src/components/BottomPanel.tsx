import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { DateTime } from "luxon";

import { EventCard } from "./event/EventCard";
import { SEARCH_HANDLE_HEIGHT, SearchHandle } from "./SearchHandle";

const BottomPanel = (props: { eventID?: string; orgID?: string }) => {
  const mapQueryEventsListSheetRef = useRef<BottomSheetModal>(null);
  const eventDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);
  const orgDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);

  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => [SEARCH_HANDLE_HEIGHT, "60%"], []);

  //#region effects
  useEffect(() => {
    if (props.eventID) {
      // navigate to event on map
      eventDetailsDisplaySheetRef.current?.present();
    }
  }, [props.eventID]);
  useLayoutEffect(() => {
    requestAnimationFrame(() => mapQueryEventsListSheetRef.current?.present());
  }, []);
  //#endregion

  const renderBackdrop = useCallback(
    //@ts-ignore
    (props) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        pressBehavior={"collapse"}
      />
    ),
    [],
  );

  // render
  const renderItem = useCallback(
    //@ts-ignore
    (item) => (
      <EventCard
        key={item}
        event={{
          bannerImgURL: "https://picsum.photos/1080/1980",
          title: "Event Title",
          orgName: "Org Name",
          orgProfileImgURL: "https://picsum.photos/200/300",
          addressDescription: "Address Description",
          timeStart: DateTime.now(),
          timeEnd: DateTime.now(),
        }}
        onPress={() => {
          // eventDetailsDisplaySheetRef.current?.present();
        }}
      />
    ),
    [],
  );

  // temp
  const data = useMemo(
    () =>
      Array(3)
        .fill(0)
        .map((_, index) => `index-${index}`),
    [],
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={mapQueryEventsListSheetRef}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
        keyboardBehavior="extend"
        bottomInset={insets.bottom}
        index={0}
        snapPoints={snapPoints}
        // onChange={handleSheetChange}
        handleHeight={SEARCH_HANDLE_HEIGHT}
        handleComponent={SearchHandle}
      >
        <BottomSheetScrollView
          contentContainerStyle={{ backgroundColor: "white" }}
        >
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheetModal>
      <BottomSheetModal
        ref={eventDetailsDisplaySheetRef}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={["80%"]}
        onDismiss={() => {
          //#ts-ignore
          router.setParams({ event: undefined });
        }}
        // onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView>
          <Text className="text-center">Awesome 🔥</Text>
          <View className="my-1 bg-black py-3">
            <Pressable
              onPress={() => {
                orgDetailsDisplaySheetRef.current?.present();
              }}
            >
              <Text className="text-white">Click</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
      <BottomSheetModal
        ref={orgDetailsDisplaySheetRef}
        bottomInset={insets.bottom}
        index={1}
        snapPoints={snapPoints}
        onDismiss={() => {}}
        // onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetView>
          <Text className="text-center">Awesome Temp</Text>
          <View className="my-1 bg-black py-3">
            <Pressable
              onPress={() => {
                eventDetailsDisplaySheetRef.current?.present();
              }}
            >
              <Text className="text-white">Click</Text>
            </Pressable>
          </View>
        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

export { BottomPanel };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     paddingTop: 200,
//   },
//   contentContainer: {
//     backgroundColor: "white",
//   },
//   itemContainer: {
//     padding: 20,
//     margin: 6,
//     backgroundColor: "#eee",
//   },
//   footerContainer: {
//     padding: 12,
//     margin: 1,
//     borderRadius: 12,
//     backgroundColor: "#80f",
//   },
//   footerText: {
//     textAlign: "center",
//     color: "white",
//     fontWeight: "800",
//   },
// });
