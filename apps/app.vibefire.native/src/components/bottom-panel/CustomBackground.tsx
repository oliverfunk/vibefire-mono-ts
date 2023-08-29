import React, { useMemo } from "react";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
} from "react-native-reanimated";
import { type BottomSheetBackgroundProps } from "@gorhom/bottom-sheet";

const CustomBackground: React.FC<BottomSheetBackgroundProps> = ({
  style,
  animatedIndex,
}) => {
  //#region styles
  const containerAnimatedStyle = useAnimatedStyle(() => ({
    // @ts-ignore
    backgroundColor: interpolateColor(
      animatedIndex.value,
      [0, 1],
      ["#ffffff", "#FF1515"],
    ),
  }));
  const containerStyle = useMemo(
    () => [style, containerAnimatedStyle],
    [style, containerAnimatedStyle],
  );
  //#endregion

  // render
  return <Animated.View pointerEvents="none" style={containerStyle} />;
};

export default CustomBackground;
