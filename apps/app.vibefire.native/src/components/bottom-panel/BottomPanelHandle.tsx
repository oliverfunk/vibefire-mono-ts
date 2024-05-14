import React, { useMemo, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { toRad } from "react-native-redash";
import { FontAwesome } from "@expo/vector-icons";
import {
  useBottomSheet,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";
import { max } from "lodash";
import { DateTime } from "luxon";

import { selectedDateDTAtom } from "@vibefire/shared-state";

import { IconButton } from "!/c/button/IconButton";
import { TimeOfDayPicker } from "!/c/TimeOfDayPicker";
import { navHomeWithProfileSelected } from "!/nav";

export const SEARCH_HANDLE_HEIGHT = 80;

const DatePicker = () => {
  const [selectedDate, setSelectedDate] = useAtom(selectedDateDTAtom);

  const [showDatePicker, setShowDatePicker] = useState(false);

  return (
    <TouchableOpacity
      className="flex-row items-center justify-center space-x-1"
      onPress={() => {
        setShowDatePicker(true);
      }}
    >
      <DateTimePickerModal
        isVisible={showDatePicker}
        date={selectedDate.toJSDate()}
        mode="date"
        locale="utc"
        onConfirm={(date) => {
          setShowDatePicker(false);
          if (date) setSelectedDate(DateTime.fromJSDate(date));
        }}
        onCancel={() => {
          setShowDatePicker(false);
        }}
        onError={(_) => {
          setShowDatePicker(false);
        }}
        maximumDate={new Date(2030, 1, 1)}
        minimumDate={new Date(2020, 1, 1)}
      />
      <FontAwesome name="calendar" size={24} color="black" />
      <Text className="text-lg">{selectedDate.toFormat("d")}</Text>
    </TouchableOpacity>
  );
};

const SearchButton = () => {
  const height = Dimensions.get("window").height;
  const width = Dimensions.get("window").width;

  const [showSearchModal, setShowSearchModal] = useState(false);
  const [searchString, setSearchString] = useState("");

  if (showSearchModal) {
    return (
      <>
        <Modal visible={showSearchModal} transparent animationType="fade">
          <Pressable
            className="h-full w-full bg-black/20"
            onPress={() => setShowSearchModal(false)}
          >
            <View
              className="absolute flex-row items-center space-x-2 overflow-hidden rounded-full bg-white px-4"
              style={{
                top: height / 10,
                left: width / 25,
                right: width / 25,
              }}
            >
              <FontAwesome name="search" size={24} color="black" />
              <TextInput
                className="rounded-lg py-4"
                style={{ fontSize: 20 }}
                placeholderTextColor={"gray"}
                multiline={true}
                onChangeText={(text) => setSearchString(text)}
                value={searchString}
                autoFocus={true}
                // placeholder="Search for a place or an event"
                placeholder="Search will be ready soon!"
              />
            </View>
          </Pressable>
        </Modal>
        <IconButton
          onPress={() => {
            setShowSearchModal(false);
          }}
          cn="bg-black"
        >
          <FontAwesome name="close" size={24} color="white" />
        </IconButton>
      </>
    );
  }

  return (
    <IconButton
      onPress={() => {
        setShowSearchModal(true);
      }}
      border={true}
      cn="bg-white"
    >
      <FontAwesome name="search" size={24} color="black" />
    </IconButton>
  );
};

const ProfileButton = () => {
  const { expand } = useBottomSheet();

  const [profileSelected, setProfileSelected] = useState(false);

  return profileSelected ? (
    <IconButton
      onPress={() => {
        navHomeWithProfileSelected({ profileSelected: false });
        setProfileSelected(false);
      }}
      cn="bg-black"
    >
      <FontAwesome name="list" size={20} color="white" />
    </IconButton>
  ) : (
    <IconButton
      onPress={() => {
        navHomeWithProfileSelected({ profileSelected: true });
        setProfileSelected(true);
        expand();
      }}
      border={true}
      cn="bg-white"
    >
      <FontAwesome name="user" size={24} color="black" />
    </IconButton>
  );
};

// <3 ignorance is bliss
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const transformOrigin = ({ x, y }, ...transformations) => {
  "worklet";
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return [
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { translateX: x },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    { translateY: y },
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    ...transformations,
    { translateX: x * -1 },
    { translateY: y * -1 },
  ];
};

const AnimatedArrow = ({ animatedIndex }: BottomSheetHandleProps) => {
  const indicatorTransformOriginY = useDerivedValue(() =>
    interpolate(animatedIndex.value, [0, 1], [-1, 1], Extrapolation.CLAMP),
  );

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
      [0, 1],
      [toRad(-30), toRad(30)],
      Extrapolation.CLAMP,
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
      [0, 1],
      [toRad(30), toRad(-30)],
      Extrapolation.CLAMP,
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

  return (
    <Animated.View renderToHardwareTextureAndroid={true}>
      <Animated.View style={[leftIndicatorStyle, leftIndicatorAnimatedStyle]} />
      <Animated.View
        style={[rightIndicatorStyle, rightIndicatorAnimatedStyle]}
      />
    </Animated.View>
  );
};

export const BottomPanelHandle = ({
  animatedIndex,
  animatedPosition,
}: BottomSheetHandleProps) => {
  const width = Dimensions.get("window").width;

  return (
    <View
      className={`flex-col justify-between space-y-4 py-2`}
      style={{
        height: SEARCH_HANDLE_HEIGHT,
      }}
    >
      <View className="flex-row justify-center">
        <AnimatedArrow
          animatedIndex={animatedIndex}
          animatedPosition={animatedPosition}
        />
      </View>

      <View className={`flex-row items-end justify-around`}>
        <SearchButton />

        <View className="flex-row items-end space-x-1">
          <View className="items-center justify-center rounded-lg border bg-white p-2">
            <DatePicker />
          </View>

          <View className="h-12 rounded-lg border bg-white">
            <TimeOfDayPicker width={max([width / 2.2, 150])!} height={10} />
          </View>
        </View>

        <ProfileButton />
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
