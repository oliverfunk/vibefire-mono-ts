import { Text, View } from "react-native";

import { type VibefireGroupT } from "@vibefire/models";

export const GroupCard = (props: {
  group: VibefireGroupT;
  onPress: (groupId: string, group: VibefireGroupT) => void;
}) => {
  const { group, onPress } = props;

  return (
    <View className="flex-row">
      <Text>{group.name}</Text>
      <Text>{group.name}</Text>
      <Text>{group.name}</Text>
    </View>
  );
};
