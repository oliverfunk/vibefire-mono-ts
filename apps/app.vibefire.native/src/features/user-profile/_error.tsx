import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSetAtom } from "jotai";

import { userSessionRetryAtom } from "!/atoms";

import { PreAuthedLayout } from "./_layout";

export const UserProfileErrorView = () => {
  const setUserSessionRetry = useSetAtom(userSessionRetryAtom);

  return (
    <PreAuthedLayout>
      <View className="flex-col items-center space-y-4 rounded-lg bg-neutral-900 p-4">
        <FontAwesome5 name="user-alt" size={50} color="red" />
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
    </PreAuthedLayout>
  );
};
