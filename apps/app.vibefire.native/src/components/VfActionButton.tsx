import React, { useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import Animated, {
  FadeIn,
  PinwheelIn,
  PinwheelOut,
} from "react-native-reanimated";
import {
  FontAwesome6,
  MaterialIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { useAtom } from "jotai";
import { max } from "lodash";
import { DateTime } from "luxon";

import { selectedDateDTAtom } from "@vibefire/shared-state";

import { IconButton } from "!/c//button/IconButton";
import { TimeOfDayPicker } from "!/c/TimeOfDayPicker";
import { navProfile } from "!/nav";

// https://docs.swmansion.com/react-native-reanimated/examples/floatingactionbutton

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const OFFSET = 50;

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
      <MaterialIcons name="event" size={24} color="white" />
      <Text className="text-lg text-white">{selectedDate.toFormat("d")}</Text>
    </TouchableOpacity>
  );
};

const FloatingActionBar = (props: { isExpandedState: boolean }) => {
  const { isExpandedState } = props;
  const width = Dimensions.get("window").width;

  if (!isExpandedState) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} className="items-center justify-center">
      <View className="flex-row items-center justify-center rounded-full bg-neutral-900 px-3 py-2 pl-5">
        <DatePicker />
        <View className="px-1" />
        <TimeOfDayPicker width={max([width / 3, 150])!} height={30} />
      </View>
    </Animated.View>
  );
};

const FloatingActionButton = (props: {
  isExpandedState: boolean;
  index: number;
  label: string;
  icon: React.ReactNode;
  onPress: () => void;
}) => {
  const { isExpandedState, index, label, icon, onPress } = props;

  if (!isExpandedState) {
    return null;
  }

  return (
    <AnimatedPressable
      onPress={onPress}
      entering={FadeIn}
      style={[
        styles.shadow,
        {
          transform: [{ translateY: -(OFFSET * index + 10) }],
        },
      ]}
      className="absolute flex-row items-center justify-end space-x-1"
    >
      <View className="items-center justify-center rounded-lg border bg-neutral-900 px-2 py-1">
        <Text className="text-white">{label}</Text>
      </View>

      <View className="items-center justify-center rounded-full bg-red-500 p-2">
        {icon}
      </View>
    </AnimatedPressable>
  );
};

export const VfActionButton = () => {
  const [isExpandedState, setIsExpandedState] = useState(false);

  const handlePress = () => {
    setIsExpandedState(!isExpandedState);
  };

  return (
    <View className="items-end">
      {/* To make the entire tappable, to dismiss the action */}

      {/* <Modal visible={isExpandedState} transparent>
        <Pressable className="h-full w-full" onPress={handlePress} />
      </Modal> */}
      <View className="flex-row space-x-4">
        <FloatingActionBar isExpandedState={isExpandedState} />

        <IconButton
          size={14}
          onPress={handlePress}
          style={{
            elevation: 8, // Shadow for Android
            shadowColor: "#000", // Shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}
          cn="bg-red-500 z-10"
        >
          {isExpandedState ? (
            <Animated.View
              key={"outFade"}
              entering={PinwheelIn}
              exiting={PinwheelOut}
            >
              <FontAwesome6 name="fire-flame-curved" size={30} color="orange" />
            </Animated.View>
          ) : (
            <Animated.View
              key={"inFade"}
              // entering={PinwheelIn}
              exiting={PinwheelOut}
            >
              <FontAwesome6 name="fire" size={30} color="white" />
            </Animated.View>
          )}
        </IconButton>
      </View>

      <FloatingActionButton
        index={1}
        isExpandedState={isExpandedState}
        label="Profile"
        icon={<FontAwesome6 name="user" size={15} color="orange" />}
        onPress={() => {
          handlePress();
          navProfile();
        }}
      />
      <FloatingActionButton
        index={2}
        isExpandedState={isExpandedState}
        label="Create Event"
        icon={<FontAwesome6 name="plus" size={15} color="orange" />}
        onPress={() => {
          console.log("Create");
        }}
      />
      <FloatingActionButton
        index={3}
        isExpandedState={isExpandedState}
        label="Create Plan"
        icon={<SimpleLineIcons name="graph" size={15} color="orange" />}
        onPress={() => {
          console.log("Create");
        }}
      />
      <FloatingActionButton
        index={4}
        isExpandedState={isExpandedState}
        label="Create Group"
        icon={<FontAwesome6 name="user-group" size={15} color="orange" />}
        onPress={() => {
          console.log("Create");
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    position: "relative",
    height: 260,
    width: "100%",
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  button: {
    width: 40,
    height: 40,
    backgroundColor: "#82cab2",
    position: "absolute",
    borderRadius: 100,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: -2,
    flexDirection: "row",
  },
  buttonContainer: {
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  shadow: {
    shadowColor: "#171717",
    shadowOffset: { width: -0.5, height: 3.5 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },
  content: {
    color: "#171717",
    fontWeight: 500,
  },
});
