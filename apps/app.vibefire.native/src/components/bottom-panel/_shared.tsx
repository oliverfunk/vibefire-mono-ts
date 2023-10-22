import React, { useCallback } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import {
  BottomSheetBackdrop,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { type BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { useFocusEffect } from "@react-navigation/native";

import { navManageEventEditReview } from "~/nav";

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

export const useSheetBackdrop = () => {
  return useCallback(
    (props: BottomSheetDefaultBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        disappearsOnIndex={0}
        appearsOnIndex={1}
        pressBehavior={"collapse"}
      />
    ),
    [],
  );
};

export const FormTextInput = (props: {
  currentValue: string;
  onChange: (text: string) => void;
  placeholder?: string;
  fontSize?: number;
}) => {
  return (
    <View className="rounded-lg border-4 border-slate-200 bg-white">
      <TextInput
        className="p-2"
        multiline={true}
        style={{ fontSize: props.fontSize ?? 18 }}
        placeholderTextColor={"#000000FF"}
        onChangeText={props.onChange}
        value={props.currentValue}
        placeholder={props.placeholder}
      />
    </View>
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

export const ScrollViewSheetWithHeader = (props: {
  header: string;
  children: React.ReactNode;
}) => (
  <BottomSheetScrollView
    automaticallyAdjustKeyboardInsets={true}
    focusHook={useFocusEffect}
  >
    <LinearRedOrangeView className="flex-row p-4">
      <View className="w-full bg-black p-4">
        <Text className="text-center text-2xl font-bold text-white">
          {props.header}
        </Text>
      </View>
    </LinearRedOrangeView>
    {props.children}
  </BottomSheetScrollView>
);

export const ReviewSaveNextFormButtons = (props: {
  eventId: string;
  onPressSave: () => void;
  onPressNext: () => void;
  savedEnabled: boolean;
}) => {
  return (
    <View className="flex-row justify-around">
      <TouchableOpacity
        className="rounded-lg border bg-white px-4 py-2"
        onPress={() => {
          navManageEventEditReview(props.eventId);
        }}
      >
        <Text className="text-xl text-black">Review</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className={`rounded-lg px-4 py-2 ${
          props.savedEnabled ? "bg-red-500" : "bg-gray-300"
        }`}
        disabled={!props.savedEnabled}
        onPress={props.onPressSave}
      >
        <Text className="text-xl text-white">Save</Text>
      </TouchableOpacity>

      <TouchableOpacity
        className="rounded-lg bg-black px-4 py-2"
        onPress={props.onPressNext}
      >
        <Text className="text-xl text-white">Next</Text>
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
