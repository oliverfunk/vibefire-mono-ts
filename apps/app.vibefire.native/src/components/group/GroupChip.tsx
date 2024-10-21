import { Text } from "react-native";

import { type TModelVibefireGroup } from "@vibefire/models";

import { VibefireImage } from "!/c/image/VibefireImage";
import { ChipComponent } from "!/c/structural/ChipComponent";

type GroupChipProps = {
  groupLinkId: string;
  groupInfo: {
    name: TModelVibefireGroup["name"];
    bannerImgKey: string;

    notifications: number;
  };
  onPress: (groupLinkId: string) => void;
};

export const GroupChip = (props: GroupChipProps) => {
  const { groupLinkId, groupInfo, onPress } = props;

  return (
    <ChipComponent
      leftComponent={<VibefireImage imgIdKey={groupInfo.bannerImgKey} />}
      centerComponent={
        <Text
          className="font-bold text-white"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {groupInfo.name}
        </Text>
      }
      rightComponent={
        <Text className="text-white">{groupInfo.notifications}</Text>
      }
      onPress={onPress ? () => onPress(groupLinkId) : undefined}
    />
  );
};
