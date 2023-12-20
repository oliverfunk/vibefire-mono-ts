import { Text, TouchableOpacity, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import {
  useBottomSheet,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";

import { LinearRedOrangeView } from "./_shared";

export const HandleWithHeader = (
  props: { header: string } & BottomSheetHandleProps,
) => {
  const { close } = useBottomSheet();
  return (
    <View className="overflow-hidden rounded-t-lg bg-black p-2">
      <LinearRedOrangeView className="flex-row items-center overflow-hidden rounded-lg px-1 py-2">
        <View className="flex-1" />
        <Text className="text-center text-2xl font-bold text-white">
          {props.header}
        </Text>
        <View className="flex-1 items-end">
          <TouchableOpacity
            className="h-5 w-5 flex-row items-center justify-center rounded-full bg-black/60"
            onPress={() => {
              close();
            }}
          >
            <FontAwesome name="chevron-down" size={10} color="white" />
          </TouchableOpacity>
        </View>
      </LinearRedOrangeView>
    </View>
  );
};
