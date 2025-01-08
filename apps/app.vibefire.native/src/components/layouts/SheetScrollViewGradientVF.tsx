import { type PropsWithChildren, type ReactNode } from "react";
import { View } from "react-native";

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
        }}
        className="space-y-4 p-2"
      >
        <View className="flex-col space-y-4">{children}</View>
        <View className="flex-col space-y-4 pb-2">
          {footer}
          <VibefireLogoName />
        </View>
      </ScrollViewSheet>
    </LinearRedOrangeView>
  );
};

export const SheetScrollViewGradient = ({ children }: PropsWithChildren) => {
  return (
    <LinearRedOrangeView className="h-full">
      <ScrollViewSheet>
        <View className="space-y-4 p-2">{children}</View>
      </ScrollViewSheet>
    </LinearRedOrangeView>
  );
};
