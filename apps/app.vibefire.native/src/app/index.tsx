import React, {
  useCallback,
  useMemo,
  useRef,
  type FC,
  type PropsWithChildren,
} from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Link } from "expo-router";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetFooter,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

import SignInWithOAuth from "~/components/auth/SignInWithOAuth";
import EventMap from "~/components/EventMap";

const SignOut = () => {
  const { isLoaded, signOut } = useAuth();
  if (!isLoaded) {
    return null;
  }
  return (
    <View>
      <Button title="Sign Out" onPress={() => void signOut()} />
    </View>
  );
};

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

  const snapPoints = useMemo(() => ["15%", "50%"], []);

  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);

  // render
  const renderItem = useCallback(
    (item) => (
      <View key={item} style={styles.itemContainer}>
        <Text>{item}</Text>
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

  const insets = useSafeAreaInsets();

  return (
    // <Stack.Screen options={{ title: "Home Page" }} />
    <SafeAreaViewNoTop>
      <EventMap />
      <BottomSheet
        ref={sheetRef}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
        backdropComponent={renderBackdrop}
        footerComponent={renderFooter}
      >
        <BottomSheetScrollView contentContainerStyle={styles.contentContainer}>
          {data.map(renderItem)}
        </BottomSheetScrollView>
      </BottomSheet>
    </SafeAreaViewNoTop>
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
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#fff",
//     alignItems: "center",
//     justifyContent: "center",
//   },
// });
