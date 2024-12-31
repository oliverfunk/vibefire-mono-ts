import {
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { Entypo, FontAwesome6 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";
import {
  ntzToDateTime,
  toMonthDateTimeStr,
  type PartialDeep,
} from "@vibefire/utils";

import { TextB } from "!/c/atomic/text";
import { ContR } from "!/c/atomic/view";

export const EventStartTimeLocationBar = (props: {
  event: PartialDeep<TModelVibefireEvent>;
  noStartTimeText: string;
  noAddressText: string;
}) => {
  const { event, noStartTimeText, noAddressText } = props;

  const startDT = event?.times?.ntzStart
    ? ntzToDateTime(event.times.ntzStart)
    : undefined;

  const isLocationEmpty =
    !event?.location?.addressDescription ||
    event.location.addressDescription.trim() === "";
  const addr = isLocationEmpty
    ? noAddressText
    : event.location!.addressDescription;

  return (
    <ContR>
      <TextB numberOfLines={2} disabled={!startDT}>
        {startDT ? toMonthDateTimeStr(startDT) : noStartTimeText}
      </TextB>
      <Entypo name="dot-single" size={15} color="white" />
      <Text
        numberOfLines={2}
        className={`text-base ${isLocationEmpty ? "text-[#909090FF]" : "text-white"}`}
      >
        {addr}
      </Text>
    </ContR>
  );
};

export const EventInfoTimesBar = (
  props: {
    event: PartialDeep<TModelVibefireEvent>;
    noStartTimeText: string;
    noEndTimeText?: string;
    iconSize?: number;
  } & ViewProps,
) => {
  const { event, noStartTimeText, noEndTimeText } = props;

  const startDT = event?.times?.ntzStart
    ? ntzToDateTime(event.times.ntzStart)
    : undefined;
  const endDT = event?.times?.ntzEnd
    ? ntzToDateTime(event.times.ntzEnd)
    : undefined;

  const isValid = startDT && endDT && startDT < endDT;

  const isNoTimeText = event?.times?.ntzEnd || noEndTimeText;

  return (
    <ContR {...props}>
      <FontAwesome6 name="clock" size={props.iconSize ?? 20} color="white" />
      <View className="flex-col">
        <Text
          className={`text-base ${startDT ? "text-white" : "text-[#909090FF]"}`}
        >
          {startDT ? toMonthDateTimeStr(startDT) : noStartTimeText}
        </Text>
        {isNoTimeText && (
          <Text className="text-base text-white">
            Until:{" "}
            <Text
              className={`text-base ${endDT ? (isValid ? "text-white" : "text-red-600") : "text-[#909090FF]"}`}
            >
              {endDT ? toMonthDateTimeStr(endDT) : noEndTimeText}
            </Text>
          </Text>
        )}
      </View>
    </ContR>
  );
};

export const EventInfoAddressDescBar = (
  props: {
    event: PartialDeep<TModelVibefireEvent>;
    noAddressDescText: string;
    iconSize?: number;
  } & ViewProps,
) => {
  const { event, noAddressDescText } = props;

  const isAddressEmpty =
    !event?.location?.addressDescription ||
    event.location.addressDescription.trim() === "";
  const addr = isAddressEmpty
    ? noAddressDescText
    : event.location!.addressDescription;

  return (
    <ContR {...props}>
      <FontAwesome6
        name="location-dot"
        size={props.iconSize ?? 20}
        color="white"
      />
      <Text
        numberOfLines={2}
        className={`text-base ${isAddressEmpty ? "text-[#909090FF]" : "text-white"}`}
      >
        {addr}
      </Text>
    </ContR>
  );
};

export const EventInfoAddressBarEditable = (
  props: ViewProps & TextInputProps,
) => {
  return (
    <ContR {...props}>
      <FontAwesome6 name="location-dot" size={20} color="white" />
      <TextInput
        numberOfLines={2}
        className="text-base text-white"
        {...props}
      />
    </ContR>
  );
};
