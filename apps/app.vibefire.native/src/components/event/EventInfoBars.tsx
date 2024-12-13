import { type ReactNode } from "react";
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewProps,
} from "react-native";
import { FontAwesome6 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";
import { ntzToDateTime, toMonthDateTimeStr } from "@vibefire/utils";

const EventInfoBar = (props: { children: ReactNode } & ViewProps) => {
  const { children } = props;

  return (
    <View className="flex-row items-center space-x-4" {...props}>
      {children}
    </View>
  );
};

export const EventInfoTimesBar = (
  props: {
    event: TModelVibefireEvent;
    noStartTimeText: string;
    noEndTimeText?: string;
  } & ViewProps,
) => {
  const { event, noStartTimeText, noEndTimeText } = props;

  const startDT = event.times.ntzStart
    ? ntzToDateTime(event.times.ntzStart)
    : undefined;
  const endDT = event.times.ntzEnd
    ? ntzToDateTime(event.times.ntzEnd)
    : undefined;

  const isValid = startDT && endDT && startDT < endDT;

  const isNoTimeText = event.times.ntzEnd || noEndTimeText;

  return (
    <EventInfoBar {...props}>
      <FontAwesome6 name="clock" size={20} color="white" />
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
    </EventInfoBar>
  );
};

export const EventInfoAddressBar = (props: {
  event: TModelVibefireEvent;
  noAddressText: string;
}) => {
  const { event, noAddressText } = props;

  const isAddressEmpty =
    !event.location.addressDescription ||
    event.location.addressDescription.trim() === "";
  const addr = isAddressEmpty
    ? noAddressText
    : event.location.addressDescription;

  return (
    <EventInfoBar>
      <FontAwesome6 name="map-location-dot" size={20} color="white" />
      <Text
        numberOfLines={2}
        className={`text-base ${isAddressEmpty ? "text-[#909090FF]" : "text-white"}`}
      >
        {addr}
      </Text>
    </EventInfoBar>
  );
};

export const EventInfoAddressBarEditable = (props: TextInputProps) => {
  return (
    <EventInfoBar>
      <FontAwesome6 name="map-location-dot" size={20} color="white" />
      <TextInput
        numberOfLines={2}
        className="text-base text-white"
        {...props}
      />
    </EventInfoBar>
  );
};
