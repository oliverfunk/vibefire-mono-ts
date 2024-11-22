import { Text } from "react-native";

import { type TModelVibefireEvent } from "@vibefire/models";
import {
  isoNTZToUTCDateTime,
  toMonthDateTimeStr,
  type PartialDeep,
} from "@vibefire/utils";

import { VibefireImage } from "!/c/image/VibefireImage";
import { ChipComponent } from "!/c/structural/ChipComponent";

type EventChipProps = {
  event: PartialDeep<TModelVibefireEvent>;
  onPress?: (event: PartialDeep<TModelVibefireEvent>) => void;
};

export const EventChip = (props: EventChipProps) => {
  const { event, onPress } = props;

  return (
    <ChipComponent
      leftComponent={
        <VibefireImage imgIdKey={event?.images?.bannerImgKeys?.[0]} />
      }
      centerComponent={
        <>
          <Text
            className="font-bold text-white"
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {event.name}
          </Text>
          <Text className="text-neutral-400">
            {event.times?.tsStart
              ? toMonthDateTimeStr(isoNTZToUTCDateTime(event.times?.tsStart))
              : "<Start Time>"}
          </Text>
        </>
      }
      rightComponent={<Text className="text-white">{event.state}</Text>}
      onPress={() => onPress?.(event)}
    />
  );
};
