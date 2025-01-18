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
        // pb-0 for annoyingness for when content is long enough to scroll
        // the padding does not apply to the bottom
        className="space-y-2 p-2 pb-0"
      >
        <View className="flex-col space-y-2">{children}</View>
        <View className="flex-col space-y-2 pb-2">
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
        <View className="space-y-2 p-2">{children}</View>
      </ScrollViewSheet>
    </LinearRedOrangeView>
  );
};
