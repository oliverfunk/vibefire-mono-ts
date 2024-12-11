import { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import { type ListRenderItemInfo } from "@shopify/flash-list";

import { type TModelVibefireEvent } from "@vibefire/models";
import { isoNTZToUTCDateTime, type PartialDeep } from "@vibefire/utils";

import { useSortedEvents } from "!/hooks/useSortedByTime";

import { SimpleList } from "!/c/list/SimpleList";
import { useItemSeparator } from "!/c/misc/ItemSeparator";
import { FlashListViewSheet } from "!/c/misc/sheet-utils";

import { EventCard } from "./EventCard";
import { EventChip } from "./EventChip";

const useEventCardRenderer = (
  onEventPress: (
    eventId: string,
    event: PartialDeep<TModelVibefireEvent>,
  ) => void,
  onEventCrossPress?: (
    eventId: string,
    event: PartialDeep<TModelVibefireEvent>,
  ) => void,
  showStatusBanner?: boolean,
) => {
  return useCallback(
    ({ item: event }: ListRenderItemInfo<PartialDeep<TModelVibefireEvent>>) => (
      <EventCard
        state={event.state}
        eventInfo={{
          bannerImgKey: event.images?.bannerImgKeys?.[0] ?? undefined,
          title: event.name!,
          ownerType: event.ownerRef!.ownerType!,
          ownerName: event.ownerRef!.ownerName!,
          addressDescription: event?.location?.addressDescription ?? undefined,
          timeStart: event.times?.tsStart
            ? isoNTZToUTCDateTime(event.times?.tsStart)
            : undefined,
          timeEnd: event.times?.tsEnd
            ? isoNTZToUTCDateTime(event.times?.tsEnd)
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
        showStatusBanner={showStatusBanner}
      />
    ),
    [onEventCrossPress, onEventPress, showStatusBanner],
  );
};

const useNoEventsText = (noEventsMessage?: string) => {
  return useMemo(() => {
    return (
      <View className="items-center justify-center pt-10">
        <Text className="text-lg font-bold text-white">
          {noEventsMessage ? noEventsMessage : "No events here yet"}
        </Text>
      </View>
    );
  }, [noEventsMessage]);
};

type EventsListProps = {
  events: PartialDeep<TModelVibefireEvent>[];
  onEventPress: (
    eventId: string,
    event: PartialDeep<TModelVibefireEvent>,
  ) => void;
  onEventCrossPress?: (
    eventId: string,
    event: PartialDeep<TModelVibefireEvent>,
  ) => void;
  listTitle?: string;
  noEventsMessage?: string;
  showStatusBanner?: boolean;
  sortAsc?: boolean;
};

export const EventsFlashListSheet = ({
  events,
  onEventPress,
  onEventCrossPress,
  listTitle,
  noEventsMessage,
  showStatusBanner = false,
  sortAsc = true,
}: EventsListProps) => {
  const sortedEvents = useSortedEvents(events, { sortAsc });

  const renderItem = useEventCardRenderer(
    onEventPress,
    onEventCrossPress,
    showStatusBanner,
  );
  const noEventsText = useNoEventsText(noEventsMessage);

  const header = useMemo(() => {
    return <Text className="text-2xl font-bold">{listTitle}</Text>;
  }, [listTitle]);

  const itemSep = useItemSeparator();

  return (
    <FlashListViewSheet
      ListEmptyComponent={noEventsText}
      ListHeaderComponent={listTitle ? header : undefined}
      ItemSeparatorComponent={itemSep}
      data={sortedEvents}
      estimatedItemSize={200}
      contentContainerStyle={{ padding: 5 }}
      renderItem={renderItem}
      keyExtractor={(item: PartialDeep<TModelVibefireEvent>) => item.id!}
    />
  );
};

// export const EventsListWithSections = ({
//   events,
//   upcomingEvents,
//   onEventPress,
//   onEventCrossPress,
//   noEventsMessage,
//   showStatusBanner = false,
//   sortAsc = true,
// }: EventsListProps & { upcomingEvents: EventsListProps["events"] }) => {
//   const sortedEvents = useSortedEvents(events, { sortAsc });
//   const sortedUpcomingEvents = useSortedEvents(upcomingEvents, { sortAsc });

//   const sections = useMemo(() => {
//     const r = [];
//     if (sortedUpcomingEvents.length > 0) {
//       r.push({
//         title: "Upcoming Events",
//         data: sortedUpcomingEvents,
//       });
//     }
//     if (sortedEvents.length > 0) {
//       r.push({
//         title: "All Events",
//         data: sortedEvents,
//       });
//     }
//     return r;
//   }, [sortedEvents, sortedUpcomingEvents]);

//   const renderSectionHeader = useCallback(
//     ({ section }: { section: { title: string } }) => (
//       <View className="p-2">
//         <Text className="text-lg font-bold text-black">{section.title}</Text>
//       </View>
//     ),
//     [],
//   );
//   const renderItem = useEventCardRenderer(
//     onEventPress,
//     onEventCrossPress,
//     showStatusBanner,
//   );
//   const noEventsText = useNoEventsText(noEventsMessage);

//   const itemSep = useItemSeparator();

//   return (
//     <SectionListViewSheet
//       ListEmptyComponent={noEventsText}
//       ItemSeparatorComponent={itemSep}
//       contentContainerStyle={{ padding: 5 }}
//       sections={sections}
//       renderSectionHeader={renderSectionHeader}
//       stickyHeaderHiddenOnScroll={true}
//       stickySectionHeadersEnabled={false}
//       renderItem={renderItem}
//       keyExtractor={(item) => item.id!}
//     />
//   );
// };

const useEventChipRenderer = (
  onPress: (event: PartialDeep<TModelVibefireEvent>) => void,
) => {
  return useCallback(
    (event: PartialDeep<TModelVibefireEvent>) => (
      <EventChip event={event} onPress={onPress} />
    ),
    [onPress],
  );
};

type EventsListSimpleChipViewProps = {
  events: PartialDeep<TModelVibefireEvent>[];
  onChipPress: (event: PartialDeep<TModelVibefireEvent>) => void;
  noEventsMessage?: string;
  latestFirst?: boolean;
  limit?: number;
};

export const EventsListSimpleChipView = ({
  events,
  onChipPress,
  noEventsMessage,
  latestFirst = true,
  limit = 4,
}: EventsListSimpleChipViewProps) => {
  const sortedEvents = useSortedEvents(events, {
    sortAsc: !latestFirst,
    sliceCount: limit,
  });

  const noEventsText = useNoEventsText(noEventsMessage);

  const renderEventChip = useEventChipRenderer(onChipPress);

  return (
    <SimpleList
      items={sortedEvents}
      itemRenderer={renderEventChip}
      noItemsComponent={noEventsText}
      styleOpts={{ separatorHeight: 4 }}
    />
  );
};
