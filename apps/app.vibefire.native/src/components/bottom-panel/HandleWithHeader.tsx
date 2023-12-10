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
      <LinearRedOrangeView className="flex-row items-center overflow-hidden rounded-lg p-2">
        <View className="flex-1 items-start">
          <TouchableOpacity
            className="flex-row items-center justify-center space-x-1 rounded-lg bg-black p-2"
            onPress={() => {
              close();
            }}
          >
            <FontAwesome name="close" size={15} color="white" />
            <Text className="text-white">Close</Text>
          </TouchableOpacity>
        </View>
        <Text className="text-center text-2xl font-bold text-white">
          {props.header}
        </Text>
        <View className="flex-1" />
      </LinearRedOrangeView>
    </View>
  );
};
