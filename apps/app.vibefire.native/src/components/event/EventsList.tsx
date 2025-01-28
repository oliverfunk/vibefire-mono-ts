import { useCallback, useMemo } from "react";
import { Text, View } from "react-native";
import { type BottomSheetFlashListProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/BottomSheetFlashList";
import { type ListRenderItemInfo } from "@shopify/flash-list";

import { type TModelVibefireEvent } from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { useSortedEvents } from "!/hooks/useSortedByTime";

import { SimpleList } from "!/c/list/SimpleList";
import { FlashListViewSheet } from "!/c/misc/sheet-utils";

import { EventCard } from "./EventCard";
import { EventChip } from "./EventChip";

const useEventCardRenderer = (
  onEventPress: (event: PartialDeep<TModelVibefireEvent>) => void,
  showState?: boolean,
) => {
  return useCallback(
    (event: PartialDeep<TModelVibefireEvent>) => (
      <EventCard
        event={event}
        showStatus={showState}
        onPress={() => {
          onEventPress(event);
        }}
      />
    ),
    [onEventPress],
  );
};

const useNoEventsText = (noEventsMessage?: string) => {
  return useMemo(() => {
    return (
      <View className="items-center justify-center rounded-xl bg-black py-[50%]">
        <Text className="text-center text-lg font-bold text-white">
          {noEventsMessage ? noEventsMessage : "No events here yet"}
        </Text>
      </View>
    );
  }, [noEventsMessage]);
};

const useNoEventsTextSmall = (noEventsMessage?: string) => {
  return useMemo(() => {
    return (
      <View className="items-center justify-center rounded-xl bg-black py-4">
        <Text className="text-center text-lg font-bold text-white">
          {noEventsMessage ? noEventsMessage : "No events here yet"}
        </Text>
      </View>
    );
  }, [noEventsMessage]);
};

type EventsListProps = {
  events: PartialDeep<TModelVibefireEvent>[];
  onEventPress: (event: PartialDeep<TModelVibefireEvent>) => void;
  listTitle?: string;
  noEventsMessage?: string;
  showStatusBanner?: boolean;
  latestFirst?: boolean;
  showStatus?: boolean;
};

export const EventCardFlashListViewSheet = (
  props: EventsListProps &
    Omit<
      BottomSheetFlashListProps<PartialDeep<TModelVibefireEvent>>,
      "data" | "renderItem"
    >,
) => {
  const {
    events,
    onEventPress,
    listTitle,
    noEventsMessage,
    latestFirst = true,
    showStatus = false,
  } = props;

  const sortedEvents = useSortedEvents(events, { sortAsc: !latestFirst });

  const renderItem = useEventCardRenderer(onEventPress, showStatus);
  const NoEventsText = useNoEventsText(noEventsMessage);

  const Header = useMemo(() => {
    return <Text className="text-2xl font-bold">{listTitle}</Text>;
  }, [listTitle]);

  return (
    <FlashListViewSheet
      ListEmptyComponent={NoEventsText}
      ListHeaderComponent={listTitle ? Header : undefined}
      data={sortedEvents}
      estimatedItemSize={200}
      renderItem={({
        item,
      }: ListRenderItemInfo<PartialDeep<TModelVibefireEvent>>) =>
        renderItem(item)
      }
      keyExtractor={(item: PartialDeep<TModelVibefireEvent>) => item.id!}
      {...props}
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

type EventsSimpleListProps = {
  events: PartialDeep<TModelVibefireEvent>[];
  onItemPress: (event: PartialDeep<TModelVibefireEvent>) => void;
  noEventsMessage?: string;
  latestFirst?: boolean;
  limit: number;
  ItemSeparatorComponent?: React.ComponentType;
};

export const EventsSimpleListChipView = ({
  events,
  onItemPress: onChipPress,
  noEventsMessage,
  latestFirst = true,
  limit,
  ItemSeparatorComponent,
}: EventsSimpleListProps) => {
  const sortedEvents = useSortedEvents(events, {
    sortAsc: !latestFirst,
    sliceCount: limit,
  });

  return (
    <SimpleList
      items={sortedEvents}
      itemRenderer={useEventChipRenderer(onChipPress)}
      noItemsComponent={useNoEventsTextSmall(noEventsMessage)}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
};

export const EventsSimpleListCardView = ({
  events,
  onItemPress,
  noEventsMessage,
  latestFirst = true,
  limit,
  ItemSeparatorComponent,
}: { showStatus: boolean } & EventsSimpleListProps) => {
  const sortedEvents = useSortedEvents(events, {
    sortAsc: !latestFirst,
    sliceCount: limit,
  });

  return (
    <SimpleList
      items={sortedEvents}
      itemRenderer={useEventCardRenderer(onItemPress)}
      noItemsComponent={useNoEventsText(noEventsMessage)}
      ItemSeparatorComponent={ItemSeparatorComponent}
    />
  );
};
