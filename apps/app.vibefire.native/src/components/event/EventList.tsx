import { useCallback } from "react";
import { Text, View } from "react-native";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";
import { isoNTZToUTCDateTime } from "@vibefire/utils";

import { EventCard } from "./EventCard";

type EventsListProps = {
  events: PartialDeep<VibefireEventT>[];
  onEventPress: (eventId: string, event: PartialDeep<VibefireEventT>) => void;
  listTitle?: string;
  noEventsMessage?: string;
  showStatusBanner?: boolean;
};

export const EventsList = ({
  events,
  onEventPress,
  listTitle,
  noEventsMessage,
  showStatusBanner = false,
}: EventsListProps) => {
  const renderItem = useCallback(
    (event: PartialDeep<VibefireEventT>, item: React.Key) => (
      <View key={item}>
        <EventCard
          eventId={event.id!}
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
          showStatusBanner={showStatusBanner}
        />
      </View>
    ),
    [onEventPress, showStatusBanner],
  );
  return (
    <View className="flex-col space-y-5 py-5">
      {listTitle && (
        <View className="flex-row items-center justify-between">
          <Text className="text-2xl font-bold">{listTitle}</Text>
        </View>
      )}
      {events.length === 0 ? (
        <View className="h-[30vh] items-center justify-center">
          <Text className="text-lg text-black">
            {noEventsMessage ? noEventsMessage : "No events here yet"}
          </Text>
        </View>
      ) : (
        events.map(renderItem)
      )}
    </View>
  );
};
