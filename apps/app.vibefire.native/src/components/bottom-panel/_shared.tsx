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
  BottomSheetScrollView,
  BottomSheetView,
  type BottomSheetScrollViewMethods,
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
        className={`px-4 text-lg font-bold ${
          props.inputRequired && "text-[#ff1111]"
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
    keyboardShouldPersistTaps={"handled"}
    keyboardDismissMode={"interactive"}
    focusHook={useFocusEffect}
  >
    {props.children}
  </BottomSheetScrollView>
);

const _ScrollViewSheetWithRef = (
  props: { children: React.ReactNode },
  ref: React.Ref<BottomSheetScrollViewMethods>,
) => (
  <BottomSheetScrollView
    ref={ref}
    automaticallyAdjustKeyboardInsets={true}
    keyboardShouldPersistTaps={"handled"}
    keyboardDismissMode={"interactive"}
    focusHook={useFocusEffect}
  >
    {props.children}
  </BottomSheetScrollView>
);
export const ScrollViewSheetWithRef = forwardRef(_ScrollViewSheetWithRef);

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
                ? props.mayProceedBg ?? "bg-black"
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
    colors={["#FF0000", "#FF4500"]}
    start={[0, 0]}
    end={[1, 1]}
    {...props}
  >
    {props.children}
  </LinearGradient>
);

export const JuicyWrapper = (props: { children: ReactNode }) => (
  <View className="w-full bg-black p-2">
    <LinearRedOrangeView className="overflow-hidden rounded-lg p-2">
      {props.children}
    </LinearRedOrangeView>
  </View>
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
//       }}
//     >
//       {props.children}
//     </BottomSheetModal>
//   );
// };
