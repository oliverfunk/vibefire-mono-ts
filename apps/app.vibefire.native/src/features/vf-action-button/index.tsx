import React, { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Modal,
  Pressable,
  View,
} from "react-native";
import { useRouter } from "expo-router";
import { FontAwesome6 } from "@expo/vector-icons";
import { useAtom } from "jotai";
import { max } from "lodash";

import { mapDisplayableEventsInfoAtom } from "@vibefire/shared-state";

import { TextS } from "!/components/atomic/text";
import { LinearRedOrangeView } from "!/components/misc/sheet-utils";
import { VibefireIconImage } from "!/components/misc/VibefireIconImage";
import { navCreateEvent, navProfile } from "!/nav";

import { DatePickerButton } from "./DatePickerButton";
import { TimeOfDayPicker } from "./TimeOfDayPicker";

const ACTION_BUTTON_OFFSET = 60;
const ACTION_BUTTON_INITAL_OFFSET = 70;

const FloatingActionBar = (props: { isExpandedState: boolean }) => {
  const { isExpandedState } = props;
  const width = Dimensions.get("window").width;

  if (!isExpandedState) {
    return null;
  }

  return (
    <View className="items-center justify-center">
      <View className="flex-row items-center justify-center space-x-2 rounded-full bg-black px-3 py-2 pl-5">
        <DatePickerButton />
        <TimeOfDayPicker pickerWidth={max([width / 3, 150])!} />
      </View>
    </View>
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
    <View
      style={{
        transform: [
          {
            translateY: -(
              ACTION_BUTTON_INITAL_OFFSET +
              ACTION_BUTTON_OFFSET * index
            ),
          },
        ],
      }}
      className="absolute"
    >
      <Pressable
        onPress={onPress}
        className="flex-row items-center justify-end space-x-2"
      >
        <View className="items-center justify-center rounded-lg bg-black p-2 px-3">
          <TextS>{label}</TextS>
        </View>
        <View className="h-9 w-9 items-center justify-center rounded-full border bg-orange-400">
          {icon}
        </View>
      </Pressable>
    </View>
  );
};

export const VfActionButton = () => {
  const [isExpandedState, setIsExpandedState] = useState(false);

  const router = useRouter();

  const [mapQueryStatus] = useAtom(mapDisplayableEventsInfoAtom);

  const handlePress = () => {
    setIsExpandedState(!isExpandedState);
  };

  return (
    <View className="android:bottom-[55] ios:bottom-[90] absolute right-2 z-0">
      <Modal visible={isExpandedState} transparent animationType="fade">
        <Pressable className="h-full w-full" onPress={handlePress}>
          {/* Replicate the button position and style in the modal */}
          <View className="android:bottom-[55] ios:bottom-[90] absolute right-2 w-full flex-col items-end">
            <View className="flex-row space-x-4">
              <FloatingActionBar isExpandedState={isExpandedState} />

              <Pressable onPress={handlePress} className="h-16 w-16">
                {isExpandedState && (
                  <View>
                    <LinearRedOrangeView className="h-full w-full items-center justify-center rounded-full pt-1">
                      <VibefireIconImage
                        variant="logo-vf-black"
                        scaleFactor={0.06}
                      />
                    </LinearRedOrangeView>
                  </View>
                )}
              </Pressable>
            </View>

            <FloatingActionButton
              index={0}
              isExpandedState={isExpandedState}
              label="Profile"
              icon={<FontAwesome6 name="user" size={15} color="black" />}
              onPress={() => {
                handlePress();
                navProfile(router);
              }}
            />
            <FloatingActionButton
              index={1}
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

      <Pressable onPress={handlePress} className="h-16 w-16">
        <View
          style={{
            shadowColor: "#000", // Shadow for iOS
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
          }}
          className="android:border android:border-black/20 h-full w-full items-center justify-center rounded-full bg-red-500 pt-1"
        >
          {mapQueryStatus.queryStatus === "loading" ? (
            <ActivityIndicator color="white" />
          ) : (
            <VibefireIconImage variant="logo-vf-white" scaleFactor={0.06} />
          )}
        </View>
      </Pressable>
    </View>
  );
};
