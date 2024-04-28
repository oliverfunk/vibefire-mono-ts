import { Pressable, Text, View } from "react-native";

import { type VibefireEventT } from "@vibefire/models";
import { isoNTZToUTCDateTime, toMonthDateTimeStr } from "@vibefire/utils";

import { EventImage } from "./EventImage";

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
    <Pressable
      className="flex-row space-x-2"
      onPress={onPress ? () => onPress(eventLinkId) : undefined}
    >
      <View className="flex-[2]">
        <EventImage imgIdKey={eventInfo.bannerImgKey} />
      </View>
      <View className="flex-[10] flex-col justify-center">
        <Text
          className="font-bold text-white"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {eventInfo.title}
        </Text>
        <Text className="text-neutral-400">
          {eventInfo.timeStartIsoNTZ
            ? toMonthDateTimeStr(isoNTZToUTCDateTime(eventInfo.timeStartIsoNTZ))
            : "<Start Time>"}
        </Text>
      </View>
      <View className="items-center justify-center">
        <Text className="text-white">{eventInfo.state}</Text>
      </View>
    </Pressable>
  );
};
