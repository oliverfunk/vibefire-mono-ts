import { Platform, Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";

import { ContinueWithApple } from "!/components/auth/ContinueWithApple";
import { ContinueWithFacebook } from "!/components/auth/ContinueWithFacebook";
import { ContinueWithGoogle } from "!/components/auth/ContinueWithGoogle";
import { LoadingSheet, ScrollViewSheet } from "!/components/utils/sheet-utils";
import { userAtom, userSessionRetryAtom } from "!/atoms";

import { UserProfileAuthenticatedView } from "./_authenticated";

const UserProfileErrorView = () => {
  const setUserSessionRetry = useSetAtom(userSessionRetryAtom);

  return (
    <ScrollViewSheet>
      <View className="mt-5 flex h-full flex-col items-center space-y-5">
        <FontAwesome5 name="user-alt" size={150} color="black" />
        <View className="flex-col items-center space-y-2">
          <Text>There was an issue loading your account</Text>
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
    </ScrollViewSheet>
  );
};

const UserProfileUnauthenticatedView = () => {
  return (
    <ScrollViewSheet>
      <View className="flex h-full flex-col items-center space-y-10 py-10">
        <FontAwesome5 name="user-alt" size={150} />
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
      </View>
    </ScrollViewSheet>
  );
};

export const UserProfile = () => {
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
