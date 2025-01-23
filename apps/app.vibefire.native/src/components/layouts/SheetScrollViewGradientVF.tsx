import { forwardRef, type PropsWithChildren, type ReactNode } from "react";
import { View } from "react-native";
import { type BottomSheetScrollViewMethods } from "@gorhom/bottom-sheet";

import { LinearRedOrangeView, ScrollViewSheet } from "!/c/misc/sheet-utils";
import { VibefireLogoName } from "!/c/VibefireBottomLogo";

export const SheetScrollViewGradientVF = ({
  children,
  footer,
}: PropsWithChildren<{ footer?: ReactNode }>) => {
  return (
    <LinearRedOrangeView className="h-full">
      <ScrollViewSheet
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: "space-between",
          padding: 8,
        }}
        className="space-y-2"
      >
        <View className="flex-col space-y-2">{children}</View>
        <View className="flex-col space-y-2">
          {footer}
          <VibefireLogoName />
        </View>
      </ScrollViewSheet>
    </LinearRedOrangeView>
  );
};

export const SheetScrollViewGradient = (
  { children }: PropsWithChildren,
  ref?: React.Ref<BottomSheetScrollViewMethods>,
) => {
  return (
    <LinearRedOrangeView className="h-full">
      <ScrollViewSheet ref={ref}>
        <View className="space-y-2 p-2">{children}</View>
      </ScrollViewSheet>
    </LinearRedOrangeView>
  );
};

export const SheetScrollViewGradientWithRef = forwardRef(
  SheetScrollViewGradient,
);

export const LinearRedOrangeContainer = ({ children }: PropsWithChildren) => {
  return (
    <LinearRedOrangeView className="space-y-2 p-2">
      {children}
    </LinearRedOrangeView>
  );
};
