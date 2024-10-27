import { Platform, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";

import { userAtom, userSessionRetryAtom } from "!/atoms";
import { ContinueWithApple } from "!/c/auth/ContinueWithApple";
import { ContinueWithFacebook } from "!/c/auth/ContinueWithFacebook";
import { ContinueWithGoogle } from "!/c/auth/ContinueWithGoogle";
import {
  BasicViewSheet,
  LinearRedOrangeView,
  LoadingSheet,
} from "!/c/misc/sheet-utils";

import { UserProfileAuthenticatedView } from "./_authenticated";

const UserProfileErrorView = () => {
  const setUserSessionRetry = useSetAtom(userSessionRetryAtom);

  return (
    <BasicViewSheet>
      <LinearRedOrangeView className="h-full flex-col items-center space-y-4 p-4">
        <View className="w-full flex-1">
          <View className="flex-col items-center space-y-4 rounded-lg bg-neutral-900 p-4">
            <FontAwesome5 name="user" size={50} color="red" />
            <Text className="text-md text-white">
              There was an issue loading your profile
            </Text>
            <TouchableOpacity
              className="rounded-lg border bg-green-500 px-4 py-2"
              onPress={() => {
                setUserSessionRetry((prev) => !prev);
              }}
            >
              <Text className="text-md text-white">Try again</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="flex-row items-center space-x-2 rounded-full bg-black p-2 px-4">
          <FontAwesome5 name="fire" size={30} color="white" />
          <Text className="text-4xl text-white">Vibefire</Text>
        </View>
      </LinearRedOrangeView>
    </BasicViewSheet>
  );
};

const UserProfileUnauthenticatedView = () => {
  return (
    <BasicViewSheet>
      <LinearRedOrangeView className="h-full flex-col items-center space-y-5 bg-slate-100 p-10">
        <View className="bg-black">
          <FontAwesome5 name="user-alt" size={150} />
        </View>
        <View className="mx-10 flex-row">
          <Text className="text-center">
            Sign in to create private events, get invites and share events with
            friends, filter and follow events and organisations.
          </Text>
        </View>
        <View className="flex-col space-y-4">
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
      </LinearRedOrangeView>
    </BasicViewSheet>
  );
};

export const UserProfileSheet = () => {
  const [user] = useAtom(userAtom);

  switch (user.state) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <UserProfileErrorView />;
    case "unauthenticated":
      return <UserProfileUnauthenticatedView />;
    case "authenticated":
      return <UserProfileAuthenticatedView appUser={user} />;
  }
};
