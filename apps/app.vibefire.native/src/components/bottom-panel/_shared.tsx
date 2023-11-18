import React, { useCallback, useEffect, useRef } from "react";
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
  BottomSheetModal,
  BottomSheetScrollView,
  BottomSheetView,
} from "@gorhom/bottom-sheet";
import { type BottomSheetDefaultBackdropProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetBackdrop/types";
import { useFocusEffect } from "@react-navigation/native";

import { usePrevious } from "~/hooks/usePrevious";

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

export const FormTitleInput = (props: {
  title: string;
  children: React.ReactNode;
  inputRequired?: boolean;
}) => {
  return (
    <View className="flex-col">
      <Text
        className={`px-4 text-lg ${props.inputRequired && "text-[#ff1111]"}`}
      >
        {props.title}
      </Text>
      <View>{props.children}</View>
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
    <View className="rounded-lg bg-slate-200">
      <TextInput
        className="px-4 py-2"
        style={{ fontSize: props.fontSize ?? 18 }}
        multiline={props.multiline ?? false}
        placeholderTextColor={"#000000FF"}
        onChangeText={props.onChangeText}
        value={props.value}
        editable={props.editable}
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
    // automaticallyAdjustKeyboardInsets={true}
    keyboardDismissMode={"on-drag"}
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

export const BackNextButtons = (props: {
  backText?: string;
  onBackPressed: () => void;
  saveText?: string;
  onSavePressed: () => void;
  nextText?: string;
  onNextPressed: () => void;
  canSave: boolean;
  mayProceed: boolean;
  mayProceedBg?: string;
  isLoading: boolean;
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
        className="flex-row items-center justify-center rounded-lg border bg-white px-4 py-2 "
        onPress={props.onBackPressed}
      >
        <>
          <MaterialIcons
            name="navigate-before"
            // removes annoying padding
            style={{ marginStart: -10 }}
            size={24}
            color="black"
          />
          <Text className="text-xl text-black">{props.backText ?? "Back"}</Text>
        </>
      </TouchableOpacity>

      <TouchableOpacity
        className={`flex-row items-center justify-center rounded-lg px-4 py-2 ${
          props.isLoading
            ? "bg-black"
            : props.canSave
            ? "bg-green-500"
            : props.mayProceed
            ? props.mayProceedBg ?? "bg-black"
            : "bg-gray-300"
        }`}
        disabled={!(props.canSave || props.mayProceed)}
        onPress={
          props.isLoading
            ? undefined
            : props.canSave
            ? props.onSavePressed
            : props.mayProceed
            ? props.onNextPressed
            : undefined
        }
      >
        {props.isLoading ? (
          <ActivityIndicator size="small" color="white" />
        ) : props.canSave ? (
          <Text className="text-xl text-white">{props.saveText ?? "Save"}</Text>
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
    colors={["#FF0000", "#FF4500"]}
    start={[0, 0]}
    end={[1, 1]}
    {...props}
  >
    {props.children}
  </LinearGradient>
);

// export const SheetModal = (props: {}) => {
//   return (
//     <BottomSheetModal
//       ref={ref}
//       stackBehavior="push"
//       backgroundStyle={{
//         backgroundColor: "black",
//       }}
//       backdropComponent={backdrop}
//       bottomInset={insets.bottom}
//       index={0}
//       snapPoints={["80%"]}
//       handleComponent={null}
//       onDismiss={() => {
//         // navClear();
//       }}
//     >
//       {props.children}
//     </BottomSheetModal>
//   );
// };
