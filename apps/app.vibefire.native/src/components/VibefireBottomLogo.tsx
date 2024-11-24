import { Text, View } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

export const VibefireBottomLogo = () => {
  return (
    <View className="flex-row items-center space-x-2 rounded-full bg-black p-2 px-4">
      <FontAwesome5 name="fire" size={30} color="white" />
      <Text className="text-4xl text-white">Vibefire</Text>
    </View>
  );
};
