import { forwardRef, useCallback, useMemo, useRef, type Ref } from "react";
import {
  ActivityIndicator,
  Platform,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { FontAwesome5 } from "@expo/vector-icons";
import {
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useFocusEffect } from "@react-navigation/native";
import { useAtomValue, useSetAtom } from "jotai";
import { DateTime } from "luxon";

import { type VibefireUserT } from "@vibefire/models";

import { ContinueWithApple } from "~/components/auth/ContinueWithApple";
import { ContinueWithFacebook } from "~/components/auth/ContinueWithFacebook";
import { ContinueWithGoogle } from "~/components/auth/ContinueWithGoogle";
import { SignOut } from "~/components/auth/SignOut";
import { EventCard } from "~/components/EventCard";
import { profileSelectedAtom, userAtom, userSessionRetryAtom } from "~/atoms";
import { SEARCH_HANDLE_HEIGHT, SearchHandle } from "../SearchHandle";
import { LinearRedPinkView, LoadingSheet } from "./_shared";

const _Profile = () => {
  const user = useAtomValue(userAtom);

  // const user = { state: "loading" };
  // const user = { state: "error", error: "GET FUCEKD" };
  // const user = { state: "unauthenticated" };
  // const user = {
  //   state: "authenticated",
  //   userInfo: {
  //     name: "John Doe",
  //     // contactEmail: "oli.readsasddasasdassk@gma.com",
  //     phoneNumber: "+447716862564",
  //   },
  // };
  const setUserSessionRetry = useSetAtom(userSessionRetryAtom);

  switch (user.state) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return (
        <BottomSheetScrollView focusHook={useFocusEffect}>
          <View className="mt-5 flex h-full flex-col items-center space-y-5">
            <FontAwesome5 name="user-alt" size={150} color="black" />
            <View className="flex-col items-center space-y-2">
              <Text>There was an issue loading your account</Text>
              <Text>{user.error}</Text>
            </View>
            <View className="flex-row">
              <TouchableOpacity
                className="rounded-lg border px-4 py-2"
                onPress={() => {
                  setUserSessionRetry((prev) => !prev);
                }}
              >
                <Text className="text-xl text-blue-500">Retry</Text>
              </TouchableOpacity>
            </View>
          </View>
        </BottomSheetScrollView>
      );
    case "unauthenticated":
      return (
        <BottomSheetScrollView focusHook={useFocusEffect}>
          <View className="mt-5 flex h-full flex-col items-center space-y-5">
            <FontAwesome5 name="user-alt" size={150} color="#ee5500" />
            <View className="mx-10 flex-row">
              <Text className="text-center">
                Sign in to create private events, get invites and share events
                with friends, filter and follow events and organisations.
              </Text>
            </View>
            <View className="flex-col space-y-2">
              <View>
                <ContinueWithGoogle />
              </View>
              <View>
                <ContinueWithFacebook />
              </View>
              {Platform.OS === "ios" && (
                <View>
                  <ContinueWithApple />
                </View>
              )}
            </View>
          </View>
        </BottomSheetScrollView>
      );
    case "authenticated":
      const userInfo = user.userInfo as VibefireUserT;
      return (
        <BottomSheetScrollView focusHook={useFocusEffect}>
          <View className="my-5 flex h-full flex-col items-center space-y-10">
            <View className="w-10/12 flex-col items-center space-y-2">
              {/* Name ball */}
              <View className="flex-row">
                <View className="h-24 w-24 items-center justify-center rounded-full bg-black">
                  <Text className="text-2xl text-white">
                    {userInfo.name.at(0)!.toUpperCase()}.{" "}
                  </Text>
                </View>
              </View>

              <View className="w-full flex-col">
                <Text className="ml-4">Email</Text>
                <View className="rounded-lg bg-slate-200 py-2">
                  {userInfo.contactEmail ? (
                    <Text className="ml-4">{userInfo.contactEmail}</Text>
                  ) : (
                    <TouchableOpacity onPress={() => {}}>
                      <Text className="ml-4">Tap to add email</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>

              <View className="w-full flex-col">
                <Text className="ml-4">Phone number</Text>
                <View className="rounded-lg bg-slate-200 py-2">
                  {userInfo.phoneNumber ? (
                    <Text className="ml-4">{userInfo.phoneNumber}</Text>
                  ) : (
                    <TouchableOpacity onPress={() => {}}>
                      <Text className="ml-4">Tap to add phone number</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>

            <LinearRedPinkView className="w-full flex-row items-center justify-center p-6">
              <TouchableOpacity
                className="rounded-lg bg-black px-4 py-2"
                onPress={() => {
                  console.log("create event");
                  router.setParams({ manageEvent: "create" });
                }}
              >
                <Text className="text-xl text-white">Create event</Text>
              </TouchableOpacity>
            </LinearRedPinkView>
            <View className="flex-row">
              <SignOut />
            </View>
          </View>
        </BottomSheetScrollView>
      );
  }
};

const _EventsList = () => {
  // call userQuery here

  const renderItem = useCallback(
    (item: React.Key) => (
      <View key={item}>
        <EventCard
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
      </View>
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
    <BottomSheetScrollView focusHook={useFocusEffect}>
      <View className="mx-2 my-2 flex flex-col space-y-4">
        {data.map(renderItem)}
      </View>
    </BottomSheetScrollView>
  );
};

const _ViewControl = (props: unknown, ref: Ref<BottomSheetModalMethods>) => {
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

export const EventsListAndProfile = forwardRef(_ViewControl);
