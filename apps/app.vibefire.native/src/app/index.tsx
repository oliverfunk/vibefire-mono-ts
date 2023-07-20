import React, {
  memo,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FC,
  type PropsWithChildren,
} from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Location from "expo-location";
import { Link } from "expo-router";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import EventMap from "~/components/EventMap";

const SafeAreaViewNoTop: FC<PropsWithChildren> = ({ children }) => {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingBottom: insets.bottom,
        paddingLeft: insets.left,
        paddingRight: insets.right,
      }}
      className={`container flex-1 items-center justify-center bg-black`}
    >
      {children}
    </View>
  );
};
const Rsv = memo(SafeAreaViewNoTop);

const Home = () => {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const data = useMemo(
    () =>
      Array(50)
        .fill(0)
        .map((_, index) => `index-${index}`),
    [],
  );

  const snapPoints = useMemo(() => ["10%", "40%"], []);

  // const handleSheetChange = useCallback((index) => {
  //   console.log("handleSheetChange", index);
  // }, []);

  // render
  const renderItem = useCallback(
    (item) => (
      <View key={item} style={styles.itemContainer}>
        <Link className="bg-black text-white" href={"/modal"}>
          Click {item}
        </Link>
      </View>
    ),
    [],
  );

  const renderFooter = useCallback(
    (props) => (
      <BottomSheetFooter {...props} bottomInset={24}>
        <View style={styles.footerContainer}>
          <Link style={styles.footerText} href={"/modal"}>
            Footer
          </Link>
        </View>
      </BottomSheetFooter>
    ),
    [],
  );

  const renderBackdrop = useCallback(
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

  const [location, setLocation] = useState<Location.LocationObject | null>(
    null,
  );
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  let text = "Waiting..";
  if (errorMsg) {
    text = errorMsg;
  } else if (location) {
    text = JSON.stringify(location);
  }

  const insets = useSafeAreaInsets();

  return (
    <Rsv>
      <EventMap />
      <BottomSheet
        ref={sheetRef}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={snapPoints}
        // onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheet>
    </Rsv>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 200,
  },
  contentContainer: {
    backgroundColor: "white",
  },
  itemContainer: {
    padding: 20,
    margin: 6,
    backgroundColor: "#eee",
  },
  footerContainer: {
    padding: 12,
    margin: 1,
    borderRadius: 12,
    backgroundColor: "#80f",
  },
  footerText: {
    textAlign: "center",
    color: "white",
    fontWeight: "800",
  },
});

export default Home;
