import { Text, View } from "react-native";

import { type EventDetail } from "@vibefire/models";

export const EventDetailWidgetView = (props: { detail: EventDetail }) => {
  const { detail } = props;

  switch (detail.type) {
    case "description":
      return (
        <View className="flex-col space-y-2">
          <Text className="text-xl font-bold text-white">
            {detail.blockTitle.trim()}
          </Text>
          <Text className="text-base text-white">{detail.value.trim()}</Text>
        </View>
      );
  }
};
