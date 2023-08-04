import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetModal,
  BottomSheetModalProvider,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import { SEARCH_HANDLE_HEIGHT, SearchHandle } from "./SearchHandle";

const BottomPanel = (props: { eventID?: string; orgID?: string }) => {
  const mapQueryEventsListSheetRef = useRef<BottomSheetModal>(null);
  const eventDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);
  const orgDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);

  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => [SEARCH_HANDLE_HEIGHT, "40%"], []);

  //#region effects
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
      <View key={item} className="my-1 bg-black py-3">
        {/* <Link className="self-center text-white" href={""}>
          {item}
        </Link> */}
        <Pressable
          onPress={() => {
            router.setParams({ mp: "31.02,-2.0,12" });
            // eventDetailsDisplaySheetRef.current?.present();
          }}
        >
          <Text className="text-white">Click {item}</Text>
        </Pressable>
      </View>
    ),
    [],
  );

  // temp
  const data = useMemo(
    () =>
      Array(50)
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
        index={1}
        snapPoints={snapPoints}
        onDismiss={() => {}}
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
