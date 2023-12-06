import { Text, View } from "react-native";
import { type BottomSheetHandleProps } from "@gorhom/bottom-sheet";

import { LinearRedOrangeView } from "./_shared";

export const HandleWithHeader = (
  props: { header: string } & BottomSheetHandleProps,
) => {
  return (
    <View className="overflow-hidden rounded-t-lg bg-black p-2">
      <LinearRedOrangeView className="overflow-hidden rounded-lg p-2">
        <Text className="text-center text-2xl font-bold text-white">
          {props.header}
        </Text>
      </LinearRedOrangeView>
    </View>
  );
};
