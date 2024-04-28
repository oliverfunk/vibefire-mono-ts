import { type ReactNode } from "react";
import { Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { IconButton } from "!/components/button/IconButton";

type SummaryHeaderProps = {
  headerTitle: string;
  headerButtonText?: string;
  onHeaderButtonPress: () => void;
};

const HeaderRow = (props: SummaryHeaderProps) => {
  const { headerTitle, headerButtonText = "New", onHeaderButtonPress } = props;
  return (
    <View className="flex-row items-center py-5 pl-5 pr-2">
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

export const SummaryCompStructure = (
  props: { children: ReactNode } & SummaryHeaderProps,
) => {
  const { headerTitle, headerButtonText, onHeaderButtonPress, children } =
    props;
  return (
    <View className="flex-col">
      <HeaderRow
        headerTitle={headerTitle}
        headerButtonText={headerButtonText}
        onHeaderButtonPress={onHeaderButtonPress}
      />
      {children}
    </View>
  );
};
