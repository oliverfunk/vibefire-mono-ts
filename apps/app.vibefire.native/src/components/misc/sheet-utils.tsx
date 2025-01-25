import React, { forwardRef, useCallback } from "react";
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
  BottomSheetFlashList,
  BottomSheetFlatList,
  BottomSheetScrollView,
  BottomSheetSectionList,
  BottomSheetView,
  type BottomSheetBackdropProps,
  type BottomSheetScrollViewMethods,
} from "@gorhom/bottom-sheet";
import { type BottomSheetFlashListProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import {
  type BottomSheetFlatListProps,
  type BottomSheetScrollViewProps,
  type BottomSheetSectionListProps,
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types";
import { type BottomSheetViewProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types";
import { useFocusEffect } from "@react-navigation/native";
import { type FallbackProps } from "react-error-boundary";

export const LoadingSheet = () => {
  return (
    <BasicViewSheet>
      <View className="h-full items-center justify-center">
        <ActivityIndicator size="large" color="white" />
      </View>
    </BasicViewSheet>
  );
};

export const ErrorSheet = (props: {
  message?: string | undefined;
  retryCallback?: () => void;
}) => {
  return (
    <BasicViewSheet>
      <View className="flex h-full flex-col items-center justify-center space-y-2">
        <Text className="text-center text-lg text-white">
          {props.message ?? "Something went wrong"}
        </Text>
        {props.retryCallback && (
          <View className="flex-row">
            <TouchableOpacity
              className="rounded-lg border border-white px-4 py-2"
              onPress={props.retryCallback}
            >
              <Text className="text-xl text-blue-500">Retry</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </BasicViewSheet>
  );
};

export function ErrorFallback({ error, resetErrorBoundary }: FallbackProps) {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return <ErrorSheet message="Couldn't load the event" />;
}

export const ErrorSheetSuspense = (props: FallbackProps) => {
  // Call resetErrorBoundary() to reset the error boundary and retry the render.

  return <ErrorSheet message="Couldn't load the event" />;
};

export const useSheetBackdrop = () => {
  return useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        // disappearsOnIndex={0}
        appearsOnIndex={0}
        pressBehavior={"collapse"}
      />
    ),
    [],
  );
};

export type FormTextInputProps = {
  value: string | undefined;
  onChangeText: (text: string) => void;
  placeholder?: string;
  fontSize?: number;
  multiline?: boolean;
  editable?: boolean;
};

export const FormTextInput = (props: FormTextInputProps) => {
  return (
    <View className="flex-1 rounded-lg bg-slate-200 p-2">
      <TextInput
        style={{ fontSize: 20 }}
        className="py-2"
        placeholderTextColor={"#909090FF"}
        {...props}
      />
    </View>
  );
};

export const BasicViewSheet = (props: BottomSheetViewProps) => {
  return <BottomSheetView focusHook={useFocusEffect} {...props} />;
};

export const SectionListViewSheet = <T, S>(
  props: BottomSheetSectionListProps<T, S>,
) => (
  <BottomSheetSectionList
    automaticallyAdjustKeyboardInsets={true}
    keyboardShouldPersistTaps={"handled"}
    keyboardDismissMode={"on-drag"}
    focusHook={useFocusEffect}
    {...props}
  />
);

export const FlatListViewSheet = <T,>(props: BottomSheetFlatListProps<T>) => (
  <BottomSheetFlatList
    automaticallyAdjustKeyboardInsets={true}
    keyboardShouldPersistTaps={"handled"}
    keyboardDismissMode={"interactive"}
    focusHook={useFocusEffect}
    {...props}
  />
);

export const FlashListViewSheet = <T,>(props: BottomSheetFlashListProps<T>) => (
  <BottomSheetFlashList
    automaticallyAdjustKeyboardInsets={true}
    keyboardShouldPersistTaps={"handled"}
    keyboardDismissMode={"interactive"}
    focusHook={useFocusEffect}
    {...props}
  />
);

export const ScrollViewSheet = (
  props: { children: React.ReactNode } & BottomSheetScrollViewProps,
  ref?: React.Ref<BottomSheetScrollViewMethods>,
) => (
  <BottomSheetScrollView
    ref={ref}
    automaticallyAdjustKeyboardInsets={true}
    keyboardShouldPersistTaps={"never"}
    keyboardDismissMode={"on-drag"}
    focusHook={useFocusEffect}
    {...props}
  >
    {props.children}
  </BottomSheetScrollView>
);

export const ScrollViewSheetWithRef = forwardRef(ScrollViewSheet);

export const LinearRedOrangeView = (
  props: { children: React.ReactNode } & ViewProps,
) => (
  <LinearGradient
    colors={["#FF0000", "#FFAA00", "#FF5500"]}
    start={[0, 0]}
    end={[1, 1]}
    {...props}
  >
    {props.children}
  </LinearGradient>
);
