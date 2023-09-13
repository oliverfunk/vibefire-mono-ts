import { on } from "events";
import React, { type ComponentType } from "react";
import {
  ActivityIndicator,
  Text,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { BottomSheetScrollView, BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";

export const navManageEventEditDescription = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId},edit,description` });
};
export const navManageEventEditLocation = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId},edit,location` });
};
export const navManageEventEditTimes = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId},edit,times` });
};
export const navManageEventCreate = () => {
  router.setParams({ manageEvent: "create" });
};
export const navManageEvent = (eventId: string) => {
  router.setParams({ manageEvent: `${eventId}` });
};
export const navManageEventClose = () => {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  router.setParams({ manageEvent: undefined });
};

export const LoadingSheet = () => {
  return (
    <BottomSheetView focusHook={useFocusEffect}>
      <View className="flex h-full flex-col items-center justify-center">
        <ActivityIndicator size="large" color="black" />
      </View>
    </BottomSheetView>
  );
};

export const ErrorSheet = (props: { message: string | undefined }) => {
  return (
    <BottomSheetView focusHook={useFocusEffect}>
      <View className="flex h-full flex-col items-center justify-center">
        <Text className="text-center text-lg">
          {props.message ?? "There was an error"}
        </Text>
      </View>
    </BottomSheetView>
  );
};

export const ScrollViewSheet = (props: { children: React.ReactNode }) => (
  <BottomSheetScrollView
    automaticallyAdjustKeyboardInsets={true}
    focusHook={useFocusEffect}
  >
    {props.children}
  </BottomSheetScrollView>
);

export const BackSaveNextFormButtons = (props: {
  onPressBack: () => void;
  onPressSave: () => void;
  onPressNext: () => void;
  hasEdited: boolean;
  backText?: string;
  nextText?: string;
}) => {
  return (
    <View className="flex-row justify-around">
      <TouchableOpacity
        className="rounded-lg border bg-white px-4 py-2"
        onPress={props.onPressBack}
      >
        <Text className="text-xl text-black">{props.backText ?? "Back"}</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`rounded-lg px-4 py-2 ${
          props.hasEdited ? "bg-red-500" : "bg-gray-300"
        }`}
        disabled={!props.hasEdited}
        onPress={props.onPressSave}
      >
        <Text className="text-xl text-white">Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="rounded-lg bg-black px-4 py-2"
        onPress={props.onPressNext}
      >
        <Text className="text-xl text-white">{props.nextText ?? "Next"}</Text>
      </TouchableOpacity>
    </View>
  );
};

export const LinearRedOrangeView = (
  props: { children: React.ReactNode } & ViewProps,
) => (
  <LinearGradient
    colors={["#FF0000", "#FF4500"]}
    start={[0, 0]}
    end={[1, 1]}
    {...props}
  >
    {props.children}
  </LinearGradient>
);
