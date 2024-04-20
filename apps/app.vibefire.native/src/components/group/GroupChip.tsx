import { Text, View } from "react-native";

import { type VibefireGroupT } from "@vibefire/models";

export const GroupChip = ({
  group,
}: {
  group: VibefireGroupT;
  onPress: (groupId: string, group: VibefireGroupT) => void;
}) => {
  return (
    <View className="flex-row">
      <Text>{group.name}</Text>
      <Text>{group.name}</Text>
      <Text>{group.name}</Text>
    </View>
  );
};
