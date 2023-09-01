import { ActivityIndicator, View, ViewProps } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "@react-navigation/native";

export const LoadingSheet = () => {
  return (
    <BottomSheetView focusHook={useFocusEffect}>
      <View className="flex h-full flex-col items-center justify-center">
        <ActivityIndicator size="large" color="black" />
      </View>
    </BottomSheetView>
  );
};

export const LinearRedPinkView = (
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

export const LinearRedOrangeView = (
  props: { children: React.ReactNode } & ViewProps,
) => (
  <LinearGradient
    colors={["#FF9A8A", "#FF4500"]}
    start={[0, 0]}
    end={[1, 1]}
    {...props}
  >
    {props.children}
  </LinearGradient>
);
