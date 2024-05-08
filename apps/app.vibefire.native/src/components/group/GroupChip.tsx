import { Text } from "react-native";

import { type VibefireGroupT } from "@vibefire/models";
import { isoNTZToUTCDateTime, toMonthDateTimeStr } from "@vibefire/utils";

import { VibefireImage } from "!/components/image/VibefireImage";
import { ChipComponent } from "!/components/structural/ChipComponent";

type GroupChipProps = {
  groupLinkId: string;
  groupInfo: {
    name: VibefireGroupT["name"];
    bannerImgKey: VibefireGroupT["banner"];
    dateUpdatedUTC: VibefireGroupT["dateUpdatedUTC"];
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
        <>
          <Text
            className="font-bold text-white"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {groupInfo.name}
          </Text>
          <Text className="text-neutral-400">
            {toMonthDateTimeStr(isoNTZToUTCDateTime(groupInfo.dateUpdatedUTC))}
          </Text>
        </>
      }
      rightComponent={
        <Text className="text-white">{groupInfo.notifications}</Text>
      }
      onPress={onPress ? () => onPress(groupLinkId) : undefined}
    />
  );
};
