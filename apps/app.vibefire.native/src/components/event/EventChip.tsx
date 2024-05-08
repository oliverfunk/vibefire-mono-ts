import { Text } from "react-native";

import { type VibefireEventT } from "@vibefire/models";
import { isoNTZToUTCDateTime, toMonthDateTimeStr } from "@vibefire/utils";

import { VibefireImage } from "!/c/image/VibefireImage";
import { ChipComponent } from "!/c/structural/ChipComponent";

type EventChipProps = {
  eventLinkId: string;
  eventInfo: {
    title: VibefireEventT["title"];
    bannerImgKey?: VibefireEventT["images"]["banner"];
    timeStartIsoNTZ?: VibefireEventT["timeStartIsoNTZ"];
    state: VibefireEventT["state"];
  };
  onPress?: (eventLinkId: string) => void;
};

export const EventChip = (props: EventChipProps) => {
  const { eventLinkId, eventInfo, onPress } = props;

  return (
    <ChipComponent
      leftComponent={<VibefireImage imgIdKey={eventInfo.bannerImgKey} />}
      centerComponent={
        <>
          <Text
            className="font-bold text-white"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {eventInfo.title}
          </Text>
          <Text className="text-neutral-400">
            {eventInfo.timeStartIsoNTZ
              ? toMonthDateTimeStr(
                  isoNTZToUTCDateTime(eventInfo.timeStartIsoNTZ),
                )
              : "<Start Time>"}
          </Text>
        </>
      }
      rightComponent={<Text className="text-white">{eventInfo.state}</Text>}
      onPress={onPress ? () => onPress(eventLinkId) : undefined}
    />
  );
};
