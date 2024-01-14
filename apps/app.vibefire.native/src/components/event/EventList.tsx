import { useCallback, useMemo } from "react";
import { Text, View, type ListRenderItemInfo } from "react-native";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";
import { isoNTZToUTCDateTime } from "@vibefire/utils";

import { FlatListViewSheet } from "../bottom-panel/_shared";
import { EventCard } from "./EventCard";

type EventsListProps = {
  events: PartialDeep<VibefireEventT>[];
  onEventPress: (eventId: string, event: PartialDeep<VibefireEventT>) => void;
  onEventCrossPress?: (
    eventId: string,
    event: PartialDeep<VibefireEventT>,
  ) => void;
  listTitle?: string;
  noEventsMessage?: string;
  showStatusBanner?: boolean;
  sortAsc?: boolean;
};

export const EventsList = ({
  events,
  onEventPress,
  onEventCrossPress,
  listTitle,
  noEventsMessage,
  showStatusBanner = false,
  sortAsc = true,
}: EventsListProps) => {
  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.timeStartIsoNTZ && b.timeStartIsoNTZ) {
        if (sortAsc) {
          return (
            new Date(a.timeStartIsoNTZ).getTime() -
            new Date(b.timeStartIsoNTZ).getTime()
          );
        } else {
          return (
            new Date(b.timeStartIsoNTZ).getTime() -
            new Date(a.timeStartIsoNTZ).getTime()
          );
        }
      } else if (a.timeStartIsoNTZ) {
        return 1;
      } else if (b.timeStartIsoNTZ) {
        return -1;
      }
      return 0;
    });
  }, [events, sortAsc]);
  const renderItem = useCallback(
    ({ item: event }: ListRenderItemInfo<PartialDeep<VibefireEventT>>) => (
      <View>
        <EventCard
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
          onCrossPress={
            onEventCrossPress
              ? () => {
                  onEventCrossPress(event.id!, event);
                }
              : undefined
          }
          state={event.state}
          showStatusBanner={showStatusBanner}
        />
      </View>
    ),
    [onEventCrossPress, onEventPress, showStatusBanner],
  );

  const header = useCallback(() => {
    return <Text className="text-2xl font-bold text-black">{listTitle}</Text>;
  }, [listTitle]);

  const noEventsText = useCallback(() => {
    return (
      <View className="h-[30vh] items-center justify-center">
        <Text className="text-lg font-bold text-black">
          {noEventsMessage ? noEventsMessage : "No events here yet"}
        </Text>
      </View>
    );
  }, [noEventsMessage]);

  return (
    <FlatListViewSheet
      ListEmptyComponent={noEventsText}
      ListHeaderComponent={listTitle ? header : undefined}
      ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      data={sortedEvents}
      contentContainerStyle={{ padding: 5 }}
      renderItem={renderItem}
      keyExtractor={(item) => item.id!}
    />
  );
  // return (
  //   <View className="items-center">
  //     {listTitle && (

  //     )}
  //     {sortedEvents.length === 0 ? (
  //       <View className="h-[30vh] items-center justify-center">
  //         <Text className="text-lg text-black">
  //           {noEventsMessage ? noEventsMessage : "No events here yet"}
  //         </Text>
  //       </View>
  //     ) : (
  //       <FlatListViewSheet
  //         data={sortedEvents}
  //         renderItem={renderItem}
  //         keyExtractor={(item) => item.id!}
  //       />
  //     )}
  //   </View>
  // );
};
