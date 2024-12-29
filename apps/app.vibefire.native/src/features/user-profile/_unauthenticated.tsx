import { Platform, Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import { ContinueWithApple } from "!/components/auth/ContinueWithApple";
import { ContinueWithFacebook } from "!/components/auth/ContinueWithFacebook";
import { ContinueWithGoogle } from "!/components/auth/ContinueWithGoogle";
import { SheetBasicColourfulVF } from "!/components/layouts/SheetBasicColourfulVF";

export const UserProfileUnauthenticatedSheet = () => {
  return (
    <SheetBasicColourfulVF>
      <View className="flex-col items-center space-y-5 rounded-lg bg-black p-4">
        <FontAwesome5 name="user-alt" size={50} color="white" />
        <Text className="text-white">
          Sign in to create private events, get invites and share events with
          friends, filter and follow events and organisers and more.
        </Text>
      </View>
      <View className="flex-1 flex-col justify-center space-y-5 self-center">
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
    </SheetBasicColourfulVF>
  );
};
