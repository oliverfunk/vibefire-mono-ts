import React, { useState } from "react";
import { Dimensions, Modal, Pressable, StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { max } from "lodash";

import { TextS } from "!/components/atomic/text";
import { LinearRedOrangeView } from "!/components/misc/sheet-utils";
import { VibefireIconImage } from "!/components/misc/VibefireIconImage";
import { navCreateEvent, navProfile } from "!/nav";

import { DatePickerButton } from "./DatePickerButton";
import { TimeOfDayPicker } from "./TimeOfDayPicker";

// https://docs.swmansion.com/react-native-reanimated/examples/floatingactionbutton

const ACTION_BUTTON_OFFSET = 50;

const FloatingActionBar = (props: { isExpandedState: boolean }) => {
  const { isExpandedState } = props;
  const width = Dimensions.get("window").width;

  if (!isExpandedState) {
    return null;
  }

  return (
    <Animated.View entering={FadeIn} className="items-center justify-center">
      <View className="flex-row items-center justify-center space-x-2 rounded-full bg-black px-3 py-2 pl-5">
        <DatePickerButton />
        <TimeOfDayPicker pickerWidth={max([width / 3, 150])!} />
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
    <Animated.View
      entering={FadeIn}
      style={[
        styles.shadow,
        {
          transform: [{ translateY: -(ACTION_BUTTON_OFFSET * index + 10) }],
        },
      ]}
      className="absolute"
    >
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-end space-x-2"
      >
        <View className="items-center justify-center rounded-lg border bg-black px-2 py-1">
          <TextS>{label}</TextS>
        </View>
        <View className="items-center justify-center rounded-full bg-orange-400 p-3">
          {icon}
        </View>
      </Pressable>
    </Animated.View>
  );
};

export const VfActionButton = () => {
  const [isExpandedState, setIsExpandedState] = useState(false);

  const router = useRouter();

  const handlePress = () => {
    setIsExpandedState(!isExpandedState);
  };

  return (
    <View className="android:bottom-[55] ios:bottom-[90] absolute right-2 z-0">
      <Modal visible={isExpandedState} transparent>
        <Pressable className="h-full w-full" onPress={handlePress}>
          {/* Replicate the button position and style in the modal */}
          <View className="android:bottom-[55] ios:bottom-[90] absolute right-2 w-full flex-col items-end">
            <View className="flex-row space-x-4">
              <FloatingActionBar isExpandedState={isExpandedState} />

              <Pressable
                onPress={handlePress}
                style={{
                  elevation: 8, // Shadow for Android
                  shadowColor: "#000", // Shadow for iOS
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.8,
                  shadowRadius: 2,
                }}
                className="h-16 w-16"
              >
                {isExpandedState && (
                  <Animated.View key={"outFade"} entering={FadeIn}>
                    <LinearRedOrangeView className="h-full w-full items-center justify-center rounded-full pt-1">
                      <VibefireIconImage
                        variant="logo-vf-black"
                        scaleFactor={0.06}
                      />
                    </LinearRedOrangeView>
                  </Animated.View>
                )}
              </Pressable>
            </View>

            <FloatingActionButton
              index={1}
              isExpandedState={isExpandedState}
              label="Profile"
              icon={<FontAwesome6 name="user" size={15} color="black" />}
              onPress={() => {
                handlePress();
                navProfile(router);
              }}
            />
            <FloatingActionButton
              index={2}
              isExpandedState={isExpandedState}
              label="Create Event"
              icon={<FontAwesome6 name="plus" size={15} color="black" />}
              onPress={() => {
                handlePress();
                navCreateEvent(router);
              }}
            />
            {/* <FloatingActionButton
        index={3}
        isExpandedState={isExpandedState}
        label="Create Plan"
        icon={<SimpleLineIcons name="graph" size={15} color="orange" />}
        onPress={() => {
          console.log("Create plan");
        }}
      />
      <FloatingActionButton
        index={4}
        isExpandedState={isExpandedState}
        label="Create Group"
        icon={<FontAwesome6 name="user-group" size={15} color="orange" />}
        onPress={() => {
          console.log("Create group");
        }}
      /> */}
          </View>
        </Pressable>
      </Modal>

      <Pressable
        onPress={handlePress}
        style={{
          elevation: 8, // Shadow for Android
          shadowColor: "#000", // Shadow for iOS
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
        }}
        className="h-16 w-16"
      >
        {!isExpandedState && (
          <Animated.View key={"inFade"} exiting={FadeOut}>
            <View className="h-full w-full items-center justify-center rounded-full bg-red-500 pt-1">
              <VibefireIconImage variant="logo-vf-white" scaleFactor={0.06} />
            </View>
          </Animated.View>
        )}
      </Pressable>
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
