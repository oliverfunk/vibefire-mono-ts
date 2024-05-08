import { type PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { type TwPadding } from "!/utils/tw-spacing";

import { IconButton } from "!/c/button/IconButton";

type SummaryHeaderProps = {
  headerTitle: string;
  headerButtonText?: string;
  onHeaderButtonPress: () => void;
};

type SummaryStyleOptions = {
  styleOpts?: {
    headerTextColor?: ["white" | "black"];
    headerPadding?: TwPadding;
  };
};

const HeaderRow = ({
  headerTitle,
  headerButtonText = "New",
  onHeaderButtonPress,
  styleOpts,
}: SummaryHeaderProps & SummaryStyleOptions) => {
  return (
    <View className={`flex-row items-center py-5`}>
      <Text className="text-xl font-bold text-white">{headerTitle}</Text>
      <View className="grow" />
      <IconButton onPress={onHeaderButtonPress} useOpacity={true} size={20}>
        <View className="flex-col items-center">
          <FontAwesome name="plus" size={15} color="white" />
          <Text className="text-sm font-bold text-white">
            {headerButtonText}
          </Text>
        </View>
      </IconButton>
    </View>
  );
};

export type SummaryCompStructureProps = SummaryHeaderProps &
  SummaryStyleOptions;

export const SummaryComponent = ({
  headerTitle,
  headerButtonText,
  onHeaderButtonPress,
  styleOpts,
  children,
}: PropsWithChildren<SummaryCompStructureProps>) => {
  return (
    <View className="flex-col">
      <HeaderRow
        headerTitle={headerTitle}
        headerButtonText={headerButtonText}
        onHeaderButtonPress={onHeaderButtonPress}
        styleOpts={styleOpts}
      />
      {children}
    </View>
  );
};
