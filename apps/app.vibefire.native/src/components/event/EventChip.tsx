import { Text, View } from "react-native";

import { type VibefireEventT } from "@vibefire/models";

type EventChipProps = {
  linkId: string;
  eventInfo: {
    title: VibefireEventT["title"];
    bannerImgKey?: string;
  };
  onPress: (linkId: string) => void;
};

export const EventChip = (props: EventChipProps) => {
  return (
    <View className="flex-row">
      <Text className="text-white">{group.name}</Text>
      <Text>{group.name}</Text>
      <Text>{group.name}</Text>
    </View>
  );
};
