import React, { ReactNode } from "react";
import { Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";

import { IconButton } from "!/components/button/IconButton";

type SummaryHeaderProps = {
  title: string;
  titleButtonText?: string;
  onTitleButtonPress: () => void;
};

const SummaryHeader = (props: SummaryHeaderProps) => {
  const { title, titleButtonText = "New", onTitleButtonPress } = props;
  return (
    <View className="flex-row items-center p-2">
      <Text className="text-xl font-bold text-white">{title}</Text>
      <View className="grow" />
      <IconButton onPress={onTitleButtonPress}>
        <View className="flex-col items-center justify-center">
          <FontAwesome name="plus" size={15} color="white" />
          <Text className="text-sm text-white">{titleButtonText}</Text>
        </View>
      </IconButton>
      {/* Find and create groups */}
    </View>
  );
};

export const SummaryList = (
  props: { children: ReactNode } & SummaryHeaderProps,
) => {
  const { title, titleButtonText, onTitleButtonPress, children } = props;
  return (
    <View className="flex-col">
      <SummaryHeader
        title={title}
        titleButtonText={titleButtonText}
        onTitleButtonPress={onTitleButtonPress}
      />
      {children}
    </View>
  );
};
