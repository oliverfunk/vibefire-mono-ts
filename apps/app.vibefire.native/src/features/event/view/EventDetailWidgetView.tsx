import { Text, View } from "react-native";

import { type EventDetail, type TModelVibefireEvent } from "@vibefire/models";

export const EventDetailWidgetView = (props: { detail: EventDetail }) => {
  const { detail } = props;

  switch (detail.type) {
    case "description":
      return (
        <View className="flex-col">
          <Text className="text-xl font-bold text-white">
            {detail.blockTitle}
          </Text>
          <View className="py-2" />
          <Text className="text-base text-white">{detail.value}</Text>
        </View>
      );
  }
};
