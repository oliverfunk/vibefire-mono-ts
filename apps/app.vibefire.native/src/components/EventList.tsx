import { useCallback } from "react";
import { Text, View } from "react-native";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";
import { isoNTZToUTCDateTime } from "@vibefire/utils";

import { EventCard } from "./EventCard";

export const EventsList: React.FC<{
  events: PartialDeep<VibefireEventT>[];
  onEventPress: (eventId: string, event: PartialDeep<VibefireEventT>) => void;
}> = ({ events, onEventPress }) => {
  const renderItem = useCallback(
    (value: PartialDeep<VibefireEventT>, item: React.Key) => (
      <View key={item}>
        <EventCard
          state={value.state!}
          eventInfo={{
            bannerImgKey: value.images?.banner ?? undefined,
            title: value.title!,
            organiserName: "Org Name",
            organiserProfileUrl: "https://picsum.photos/200/300",
            addressDescription:
              value?.location?.addressDescription ?? undefined,
            timeStart: value.timeStartIsoNTZ
              ? isoNTZToUTCDateTime(value.timeStartIsoNTZ)
              : undefined,
            timeEnd: value.timeEndIsoNTZ
              ? isoNTZToUTCDateTime(value.timeEndIsoNTZ)
              : undefined,
          }}
          onPress={() => {
            onEventPress(value.id!);
          }}
        />
      </View>
    ),
    [onEventPress],
  );
  return (
    <View className="flex-col space-y-5">
      {events.length === 0 ? (
        <View className="h-[50vh] items-center justify-center bg-black py-5">
          <Text className="text-lg text-white">No events yet</Text>
        </View>
      ) : (
        events.map(renderItem)
      )}
    </View>
  );
};
