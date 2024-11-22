import React, {
  forwardRef,
  useCallback,
  useEffect,
  type ReactNode,
} from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  type ViewProps,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
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
  type BottomSheetSectionListProps,
} from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types";
import { type BottomSheetViewProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetView/types";
import { useFocusEffect } from "@react-navigation/native";
import { type FallbackProps } from "react-error-boundary";

import { usePrevious } from "!/hooks/usePrevious";

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
      <View className="flex h-full flex-col items-center justify-center">
        <Text className="text-center text-lg">
          {props.message ?? "Something went wrong"}
        </Text>
        {props.retryCallback && (
          <View className="flex-row">
            <TouchableOpacity
              className="rounded-lg border px-4 py-2"
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

export const FormTitleInput = (props: {
  title: string;
  children: React.ReactNode;
  underneathText?: string;
  inputRequired?: boolean;
}) => {
  return (
    <View className="flex-col">
      <Text
        className={`pl-3 text-lg font-bold ${
          props.inputRequired ? "text-[#ff1111]" : "text-white"
        }`}
      >
        {props.title}
        {props.inputRequired && "*"}
      </Text>
      <View>{props.children}</View>
      {props.underneathText && (
        <Text className="px-4 text-center text-sm">{props.underneathText}</Text>
      )}
    </View>
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

export const FormTitleTextInput = (
  props: { title: string; inputRequired?: boolean } & FormTextInputProps,
) => {
  return (
    <FormTitleInput title={props.title} inputRequired={props.inputRequired}>
      <FormTextInput
        fontSize={props.fontSize}
        onChangeText={props.onChangeText}
        value={props.value}
        placeholder={props.placeholder}
        multiline={props.multiline}
        editable={props.editable}
      />
    </FormTitleInput>
  );
};

export const FormTextInput = (props: FormTextInputProps) => {
  return (
    <View className="flex-1 rounded-lg bg-slate-200">
      <TextInput
        className="px-3 py-2"
        style={{ fontSize: props.fontSize ?? 18 }}
        multiline={props.multiline ?? false}
        placeholderTextColor={"#909090FF"}
        onChangeText={props.onChangeText}
        value={props.value}
        editable={props.editable}
        placeholder={props.placeholder}
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
  props: { children: React.ReactNode },
  ref?: React.Ref<BottomSheetScrollViewMethods>,
) => (
  <BottomSheetScrollView
    ref={ref}
    automaticallyAdjustKeyboardInsets={true}
    keyboardShouldPersistTaps={"never"}
    keyboardDismissMode={"on-drag"}
    focusHook={useFocusEffect}
  >
    {props.children}
  </BottomSheetScrollView>
);

export const ScrollViewSheetWithRef = forwardRef(ScrollViewSheet);

export const BackNextButtons = (props: {
  onBackPressed: () => void;
  onNextPressed: () => void;
  nextText?: string;
  onCancelPressed: () => void;
  onSavePressed: () => void;
  isEdited: boolean;
  isLoading: boolean;
  mayProceed: boolean;
  mayProceedBg?: string;
  nextAfterLoading?: boolean;
}) => {
  const prevLoading = usePrevious(props.isLoading);
  useEffect(() => {
    if (
      prevLoading &&
      !props.isLoading &&
      props.nextAfterLoading &&
      props.mayProceed
    ) {
      props.onNextPressed();
    }
  }, [
    prevLoading,
    props.isLoading,
    props.onNextPressed,
    props.nextAfterLoading,
    props,
  ]);
  return (
    <View className="flex-row justify-around">
      <TouchableOpacity
        className={`flex-row items-center justify-center rounded-lg px-4 py-2 ${
          props.isEdited ? "bg-[#ff0000]" : "border bg-white"
        }`}
        onPress={props.isEdited ? props.onCancelPressed : props.onBackPressed}
      >
        {props.isEdited ? (
          <Text className="text-xl text-white">Cancel</Text>
        ) : (
          <>
            <MaterialIcons
              name="navigate-before"
              // removes annoying padding
              style={{ marginStart: -10 }}
              size={24}
              color="black"
            />
            <Text className="text-xl text-black">Back</Text>
          </>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-row items-center justify-center rounded-lg px-4 py-2 ${
          props.isLoading
            ? "bg-black"
            : props.isEdited
              ? "bg-green-500"
              : props.mayProceed
                ? (props.mayProceedBg ?? "bg-black")
                : "bg-gray-300"
        }`}
        disabled={!(props.isEdited || props.mayProceed)}
        onPress={
          props.isLoading
            ? undefined
            : props.isEdited
              ? props.onSavePressed
              : props.mayProceed
                ? props.onNextPressed
                : undefined
        }
      >
        {props.isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : props.isEdited ? (
          <Text className="text-xl text-white">Save</Text>
        ) : (
          <>
            <Text className="text-xl text-white">
              {props.nextText ?? "Next"}
            </Text>
            <MaterialIcons
              name="navigate-next"
              // removes annoying padding
              style={{ marginEnd: -10 }}
              size={24}
              color="white"
            />
          </>
        )}
      </TouchableOpacity>
    </View>
  );
};

export const LinearRedOrangeView = (
  props: { children: React.ReactNode } & ViewProps,
) => (
  <LinearGradient
    colors={["#FF0000", "#FFA000", "#462DFF"]}
    start={[0, 0]}
    end={[1, 1]}
    {...props}
  >
    {props.children}
  </LinearGradient>
);

export const SectionHeader = (props: {
  text: string;
  children?: ReactNode;
}) => (
  <View className="bg-black p-4">
    <Text className="text-lg text-white">{props.text}</Text>
    {props.children}
  </View>
);
