import { type ReactNode } from "react";
import { View } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

export const EditableIconWrapper = (props: {
  children: ReactNode;
  center?: boolean;
}) => {
  const { center, children } = props;
  return (
    <View className="flex-row items-center">
      {center && <FontAwesome6 name="edit" size={12} color="transparent" />}
      <View className="flex-1">{children}</View>
      <FontAwesome6 name="edit" size={12} color="white" />
    </View>
  );
};
