import { type ReactNode } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  type GestureResponderEvent,
} from "react-native";

export const AuthButton = (props: {
  text: string;
  icon: ReactNode;
  onPress: (event: GestureResponderEvent) => void;
}) => (
  <TouchableOpacity
    className="flex-row items-center rounded-lg border p-2"
    onPress={props.onPress}
  >
    <View className="w-10 items-center">{props.icon}</View>
    <Text>{props.text}</Text>
  </TouchableOpacity>
);
