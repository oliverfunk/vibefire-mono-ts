import React, { memo, useMemo } from "react";
import { View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { type BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";

const CustomBackgroundComponent: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  // const containerAnimatedStyle = useAnimatedStyle(() => ({
  //   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  //   // @ts-ignore
  //   backgroundColor: interpolateColor(
  //     animatedIndex.value,
  //     [0, 1],
  //     ["#ffffff", "#FF1515"],
  //   ),
  // }));
  const containerStyle = useMemo(
    () => [style, { backgroundColor: "#000000" }],
    [style],
  );

  // render
  return <View pointerEvents="none" style={containerStyle} />;
};
export const CustomBackground = memo(CustomBackgroundComponent);
