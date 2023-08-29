import { forwardRef, memo, useCallback, useMemo, type Ref } from "react";
import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  BottomSheetBackgroundProps,
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useFocusEffect } from "@react-navigation/native";
import { useAtomValue } from "jotai";
import { DateTime } from "luxon";

import SignInWithOAuth from "~/components/auth/SignInWithOAuth";
import { EventCard } from "~/components/event/EventCard";
import { profileSelectedAtom, userAtom } from "~/atoms";
import { AniHandle } from "../AniHandle";
import CustomBackground from "../CustomBackground";
import { SEARCH_HANDLE_HEIGHT, SearchHandle } from "../SearchHandle";

const _Profile = () => {
  const user = useAtomValue(userAtom);
  return (
    <BottomSheetScrollView focusHook={useFocusEffect}>
      <View className="mt-1 flex flex-col items-center">
        {user === undefined ? (
          <>
            <FontAwesome name="user" size={200} color="#ffaa00" />
            {/* <FontAwesome name="user-circle-o" size={200} color="black" /> */}
            {/* <FontAwesome name="user-circle-o" size={200} color="black" /> */}
            <View className="flex flex-row">
              <Text className="text-2xl">By signing in...</Text>
            </View>
            <SignInWithOAuth />
          </>
        ) : (
          <>
            <View className="flex flex-row">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-black">
                <Text className="text-2xl text-white">
                  {user.name.at(0)?.toUpperCase()}.{" "}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>
    </BottomSheetScrollView>
  );
};

const _EventsList = () => {
  const renderItem = useCallback(
    (item: React.Key) => (
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
          router.setParams({ eventId: item.toString() });
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

  return <BottomSheetScrollView>{data.map(renderItem)}</BottomSheetScrollView>;
};

const _Control = (props: unknown, ref: Ref<BottomSheetModalMethods>) => {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => [SEARCH_HANDLE_HEIGHT, "60%"], []);

  const profileSelected = useAtomValue(profileSelectedAtom);

  return (
    <BottomSheetModal
      ref={ref}
      enableDismissOnClose={false}
      enablePanDownToClose={false}
      // backdropComponent={({}) => {}}
      // backgroundComponent={CustomBackground}
      backgroundStyle={{
        backgroundColor: "white",
      }}
      keyboardBehavior="extend"
      bottomInset={insets.bottom}
      index={0}
      snapPoints={snapPoints}
      // onChange={handleSheetChange}
      handleHeight={SEARCH_HANDLE_HEIGHT}
      handleComponent={SearchHandle}
    >
      {profileSelected ? <_Profile /> : <_EventsList />}
    </BottomSheetModal>
  );
};

export const EventsListAndProfile = forwardRef(_Control);
