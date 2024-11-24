import { type ReactNode } from "react";
import { View } from "react-native";

import { BasicViewSheet, LinearRedOrangeView } from "!/c/misc/sheet-utils";
import { VibefireBottomLogo } from "!/c/VibefireBottomLogo";

export const SheetBasicColourfulVF = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <BasicViewSheet>
      <LinearRedOrangeView className="h-full flex-col items-center space-y-4 p-4">
        <View className="w-full flex-1">{children}</View>
        <VibefireBottomLogo />
      </LinearRedOrangeView>
    </BasicViewSheet>
  );
};
