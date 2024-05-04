import { View } from "react-native";
import { Image } from "expo-image";

export const VibefireIconImage = () => {
  return (
    <View className="items-center p-10">
      <Image
        alt="Vibefire Event icon"
        contentFit={"contain"}
        className="aspect-[4/4] w-44"
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        source={require("#/images/mapmarker-neutral.svg")}
      />
    </View>
  );
};
