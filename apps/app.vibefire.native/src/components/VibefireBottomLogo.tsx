import { Text, View } from "react-native";
import { ViewProps } from "react-native-svg/lib/typescript/fabric/utils";
import { FontAwesome5 } from "@expo/vector-icons";

export const VibefireLogoName = (props: ViewProps) => {
  return (
    <View className="self-center rounded-full bg-black p-2 px-6" {...props}>
      <Text className="text-center text-4xl text-white">
        <FontAwesome5 name="fire" size={30} color="white" /> Vibefire
      </Text>
    </View>
  );
};
