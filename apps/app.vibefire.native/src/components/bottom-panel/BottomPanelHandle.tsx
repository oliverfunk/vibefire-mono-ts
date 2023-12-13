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
  Extrapolate,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
} from "react-native-reanimated";
import { toRad } from "react-native-redash";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import {
  useBottomSheet,
  type BottomSheetHandleProps,
} from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";
import { max } from "lodash";
import { DateTime } from "luxon";

import { selectedDateDTAtom } from "@vibefire/shared-state";

import { TimeOfDayPicker } from "~/components/TimeOfDayPicker";
import { profileSelectedAtom } from "~/atoms";

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
      <FontAwesome5 name="calendar-alt" size={20} color="black" />
      <Text className="text-lg">{selectedDate.toFormat("d")}</Text>
    </TouchableOpacity>
  );
};

const IconButton = (props: {
  icon: React.ReactNode;
  onPress: () => void;
  cn?: string;
}) => {
  return (
    <Pressable
      className={`h-10 w-10 items-center justify-center rounded-full border ${props.cn}`}
      onPress={props.onPress}
    >
      {props.icon}
    </Pressable>
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
              <FontAwesome5 name="search" size={20} color="black" />
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
          icon={<FontAwesome name="close" size={20} color="white" />}
          onPress={() => {
            setShowSearchModal(false);
          }}
          cn="bg-black"
        />
      </>
    );
  }

  return (
    <IconButton
      icon={<FontAwesome5 name="search" size={20} color="black" />}
      onPress={() => {
        setShowSearchModal(true);
      }}
      cn="bg-white"
    />
  );
};

const ProfileButton = () => {
  const [profileSelected, setProfileSelected] = useAtom(profileSelectedAtom);

  const { expand } = useBottomSheet();

  return profileSelected ? (
    <IconButton
      icon={<MaterialIcons name="view-list" size={24} color="white" />}
      onPress={() => {
        setProfileSelected(false);
      }}
      cn="bg-black"
    />
  ) : (
    <IconButton
      icon={<FontAwesome5 name="user-alt" size={20} color="black" />}
      onPress={() => {
        setProfileSelected(true);
        expand();
      }}
      cn="bg-white"
    />
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
    interpolate(animatedIndex.value, [0, 1], [-1, 1], Extrapolate.CLAMP),
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
      [0, 1],
      [toRad(30), toRad(-30)],
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
    <View className={`flex-row items-end justify-around pb-2 pt-2`}>
      <SearchButton />

      <View className="flex-col items-center justify-center space-y-5">
        <AnimatedArrow
          animatedIndex={animatedIndex}
          animatedPosition={animatedPosition}
        />
        <View className="flex-row space-x-1">
          <View className="items-center justify-center rounded-lg border px-2">
            <DatePicker />
          </View>
          <View className="rounded-lg border">
            <TimeOfDayPicker
              width={max([width / 2, 150])!}
              height={SEARCH_HANDLE_HEIGHT / 2}
            />
          </View>
        </View>
      </View>

      <ProfileButton />
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
