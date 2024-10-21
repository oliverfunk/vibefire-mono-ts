import { Text, View } from "react-native";

import { type TModelVibefireGroup } from "@vibefire/models";

export const GroupCard = (props: {
  group: TModelVibefireGroup;
  onPress: (groupId: string, group: TModelVibefireGroup) => void;
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
