import { type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

import {
  BasicViewSheet,
  LinearRedOrangeView,
} from "!/components/misc/sheet-utils";

export const PreAuthedLayout = ({ children }: { children: ReactNode }) => {
  return (
    <BasicViewSheet>
      <LinearRedOrangeView className="h-full flex-col items-center p-4">
        <View className="w-full flex-1">{children}</View>

        <View className="flex-row items-center space-x-2 rounded-full bg-black p-2 px-4">
          <FontAwesome5 name="fire" size={30} color="white" />
          <Text className="text-4xl text-white">Vibefire</Text>
        </View>
      </LinearRedOrangeView>
    </BasicViewSheet>
  );
};
