import { Pressable, View } from "react-native";

export type ChipComponentProps = {
  leftComponent: React.ReactNode;
  centerComponent: React.ReactNode;
  rightComponent: React.ReactNode;
  onPress?: () => void;
};

export const ChipComponent = (props: ChipComponentProps) => {
  const { leftComponent, centerComponent, rightComponent, onPress } = props;

  return (
    <Pressable className="flex-row space-x-2" onPress={onPress}>
      <View className="flex-[2] justify-center">{leftComponent}</View>
      <View className="flex-[10] flex-col justify-center">
        {centerComponent}
      </View>
      <View className="items-center justify-center">{rightComponent}</View>
    </Pressable>
  );
};
