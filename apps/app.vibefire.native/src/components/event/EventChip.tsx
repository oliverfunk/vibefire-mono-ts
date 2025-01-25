import { Text } from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";
import {
  ntzToDateTime,
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
            {event.times?.ntzStart
              ? toMonthDateTimeStr(ntzToDateTime(event.times?.ntzStart))
              : "<Start Time>"}
          </Text>
        </>
      }
      rightComponent={
        event.state === 1 ? (
          <FontAwesome6 name="eye" size={15} color="white" />
        ) : (
          <FontAwesome6 name="eye-slash" size={15} color="red" />
        )
      }
      onPress={() => onPress?.(event)}
    />
  );
};
