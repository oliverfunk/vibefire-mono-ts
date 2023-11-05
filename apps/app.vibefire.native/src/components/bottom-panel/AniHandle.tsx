/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import React, { useCallback, useMemo, useState } from "react";
import {
  NativeSyntheticEvent,
  Pressable,
  StyleSheet,
  TextInputChangeEventData,
  View,
  type StyleProp,
  type ViewStyle,
} from "react-native";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { toRad } from "react-native-redash";
import { FontAwesome, FontAwesome5 } from "@expo/vector-icons";
import {
  useBottomSheet,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";

import { TimePeriodPicker } from "~/components/TimePeriodPicker";
import { profileSelectedAtom } from "~/atoms";

export const SEARCH_HANDLE_HEIGHT = 70;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
export const transformOrigin = ({ x, y }, ...transformations) => {
  "worklet";
  return [
    { translateX: x },
    { translateY: y },
    ...transformations,
    { translateX: x * -1 },
    { translateY: y * -1 },
  ];
};

interface HandleProps extends BottomSheetHandleProps {
  style?: StyleProp<ViewStyle>;
}

export const AniHandle: React.FC<HandleProps> = ({ style, animatedIndex }) => {
  //#region animations
  const indicatorTransformOriginY = useDerivedValue(() =>
    interpolate(animatedIndex.value, [0, 1, 2], [-1, 0, 1], Extrapolate.CLAMP),
  );
  //#endregion

  //#region styles
  const containerStyle = useMemo(() => [styles.header, style], [style]);
  const containerAnimatedStyle = useAnimatedStyle(() => {
    const borderTopRadius = interpolate(
      animatedIndex.value,
      [1, 2],
      [20, 0],
      Extrapolate.CLAMP,
    );
    return {
      borderTopLeftRadius: borderTopRadius,
      borderTopRightRadius: borderTopRadius,
    };
  });
  const leftIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.leftIndicator,
    }),
    [],
  );
  const leftIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const leftIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(-30), 0, toRad(30)],
      Extrapolate.CLAMP,
    );
    return {
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY.value },
        {
          rotate: `${leftIndicatorRotate}rad`,
        },
        {
          translateX: -5,
        },
      ),
    };
  });
  const rightIndicatorStyle = useMemo(
    () => ({
      ...styles.indicator,
      ...styles.rightIndicator,
    }),
    [],
  );
  const rightIndicatorAnimatedStyle = useAnimatedStyle(() => {
    const rightIndicatorRotate = interpolate(
      animatedIndex.value,
      [0, 1, 2],
      [toRad(30), 0, toRad(-30)],
      Extrapolate.CLAMP,
    );
    return {
      transform: transformOrigin(
        { x: 0, y: indicatorTransformOriginY.value },
        {
          rotate: `${rightIndicatorRotate}rad`,
        },
        {
          translateX: 5,
        },
      ),
    };
  });

  const [profileSelected, setProfileSelected] = useAtom(profileSelectedAtom);
  const [value, setValue] = useState("initialValue");
  const { expand } = useBottomSheet();

  //#endregion

  // render
  return (
    <View
      className={`h-[${SEARCH_HANDLE_HEIGHT + 1}px] flex-col justify-center`}
    >
      <View className="h-4 flex-row items-start justify-center">
        <Animated.View
          style={[containerStyle, containerAnimatedStyle]}
          renderToHardwareTextureAndroid={true}
        >
          <Animated.View
            style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]}
          />
          <Animated.View
            style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]}
          />
        </Animated.View>
      </View>
      <View className="flex-row items-center justify-between px-4">
        <Pressable
          className={`h-10 w-10 items-center justify-center rounded-full border ${
            profileSelected ? "bg-black" : "bg-white"
          }`}
          onPress={() => {
            const showProfile = !profileSelected;
            setProfileSelected(showProfile);
            if (showProfile) {
              expand();
            }
          }}
        >
          <FontAwesome5 name="search" size={20} color="black" />
        </Pressable>
        <View className="flex-row space-x-1">
          <View className="rounded-xl bg-blue-400">
            <TimePeriodPicker width={50} height={SEARCH_HANDLE_HEIGHT / 2} />
          </View>
          <View className="rounded-xl bg-blue-400">
            <TimePeriodPicker width={200} height={SEARCH_HANDLE_HEIGHT / 2} />
          </View>
        </View>
        <Pressable
          className={`h-10 w-10 items-center justify-center rounded-full border ${
            profileSelected ? "bg-black" : "bg-white"
          }`}
          onPress={() => {
            const showProfile = !profileSelected;
            setProfileSelected(showProfile);
            if (showProfile) {
              expand();
            }
          }}
        >
          {profileSelected ? (
            <FontAwesome name="close" size={20} color="white" />
          ) : (
            <FontAwesome5 name="user-alt" size={20} color="black" />
          )}
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  indicator: {
    position: "absolute",
    width: 10,
    height: 4,
    backgroundColor: "#999",
  },
  leftIndicator: {
    borderTopStartRadius: 2,
    borderBottomStartRadius: 2,
  },
  rightIndicator: {
    borderTopEndRadius: 2,
    borderBottomEndRadius: 2,
  },
});
