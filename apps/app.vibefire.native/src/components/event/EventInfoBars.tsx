import { type ReactNode } from "react";
import {
  Text,
  TextInput,
  TextInputProps,
  View,
  type ViewProps,
} from "react-native";
import { FontAwesome, FontAwesome6 } from "@expo/vector-icons";

import { type TModelVibefireEvent } from "@vibefire/models";

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
    noEndTimeText?: string;
  } & ViewProps,
) => {
  const { event, noEndTimeText } = props;

  const isNoTimeText = event.times.tsEnd || noEndTimeText;

  return (
    <EventInfoBar {...props}>
      <FontAwesome6 name="clock" size={20} color="white" />
      <View className="flex-col">
        <Text className="text-base text-white">
          {event.times.tsStart ?? "set a start time"}
        </Text>
        {isNoTimeText && (
          <Text className="text-base text-white">
            {event.times.tsEnd ?? noEndTimeText}
          </Text>
        )}
      </View>
    </EventInfoBar>
  );
};

export const EventInfoAddressBar = (props: { event: TModelVibefireEvent }) => {
  const { event } = props;

  return (
    <EventInfoBar>
      <FontAwesome6 name="map-location-dot" size={20} color="white" />
      <Text numberOfLines={2} className="text-base text-white">
        {event.location.addressDescription ?? "set a start time"}
      </Text>
    </EventInfoBar>
  );
};

export const EventInfoAddressBarEditable = (
  props: {
    event: TModelVibefireEvent;
  } & TextInputProps,
) => {
  const { event } = props;

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
