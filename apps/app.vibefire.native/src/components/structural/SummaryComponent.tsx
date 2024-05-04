import { type PropsWithChildren } from "react";
import { Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { pl, pr, py, tws, type TwPadding } from "!/utils/tw-spacing";

import { IconButton } from "!/components/button/IconButton";

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
    <View className={`flex-row items-center ${tws(styleOpts?.headerPadding)}`}>
      <Text className="text-xl font-bold text-white">{headerTitle}</Text>
      <View className="grow" />
      <IconButton onPress={onHeaderButtonPress} useOpacity={true} size={20}>
        <View className="flex-col items-center bg-black p-4">
          <FontAwesome name="plus" size={15} color="white" />
          <Text className="text-sm font-bold text-white">
            {headerButtonText}
          </Text>
        </View>
      </IconButton>
      {/* Find and create groups */}
    </View>
  );
};

export type SummaryCompStructureProps = SummaryHeaderProps &
  SummaryStyleOptions;

export const SummaryCompStructure = ({
  headerTitle,
  headerButtonText,
  onHeaderButtonPress,
  children,
}: PropsWithChildren<SummaryCompStructureProps>) => {
  return (
    <View className="flex-col">
      <HeaderRow
        headerTitle={headerTitle}
        headerButtonText={headerButtonText}
        onHeaderButtonPress={onHeaderButtonPress}
        styleOpts={{
          headerPadding: [py("5"), pl("5"), pr("2")],
        }}
      />
      {children}
    </View>
  );
};
