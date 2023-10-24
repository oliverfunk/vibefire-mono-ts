import { useCallback } from "react";
import { Text, View } from "react-native";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";
import { isoNTZToUTCDateTime } from "@vibefire/utils";

import { EventCard } from "./EventCard";

type EventsListProps = {
  events: PartialDeep<VibefireEventT>[];
  onEventPress: (eventId: string, event: PartialDeep<VibefireEventT>) => void;
  showPublishedBanner?: boolean;
};

export const EventsList = ({
  events,
  onEventPress,
  showPublishedBanner = false,
}: EventsListProps) => {
  const renderItem = useCallback(
    (event: PartialDeep<VibefireEventT>, item: React.Key) => (
      <View key={item}>
        <EventCard
          state={event.state!}
          published={event.published!}
          eventInfo={{
            bannerImgKey: event.images?.banner ?? undefined,
            title: event.title!,
            organiserId: event.organiserId!,
            organiserType: event.organiserType!,
            organiserName: event.organiserName!,
            addressDescription:
              event?.location?.addressDescription ?? undefined,
            timeStart: event.timeStartIsoNTZ
              ? isoNTZToUTCDateTime(event.timeStartIsoNTZ)
              : undefined,
            timeEnd: event.timeEndIsoNTZ
              ? isoNTZToUTCDateTime(event.timeEndIsoNTZ)
              : undefined,
          }}
          onPress={() => {
            onEventPress(event.id!, event);
          }}
          showPublishedBanner={showPublishedBanner}
        />
      </View>
    ),
    [onEventPress, showPublishedBanner],
  );
  return (
    <View className="flex-col space-y-5">
      {events.length === 0 ? (
        <View className="h-[30vh] items-center justify-center">
          <Text className="text-lg text-black">No events yet</Text>
        </View>
      ) : (
        events.map(renderItem)
      )}
    </View>
  );
};
