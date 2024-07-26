import { useCallback, useMemo } from "react";
import { Text, View, type ListRenderItemInfo } from "react-native";

import { type VibefireEventT } from "@vibefire/models";
import { isoNTZToUTCDateTime, type PartialDeep } from "@vibefire/utils";

import { useSortedEvents } from "!/hooks/useSortedByTime";

import { SimpleList } from "!/c/list/SimpleList";
import { useItemSeparator } from "!/c/misc/ItemSeparator";
import { FlatListViewSheet, SectionListViewSheet } from "!/c/misc/sheet-utils";

import { EventCard } from "./EventCard";
import { EventChip } from "./EventChip";

const useEventCardRenderer = (
  onEventPress: (eventId: string, event: PartialDeep<VibefireEventT>) => void,
  onEventCrossPress?: (
    eventId: string,
    event: PartialDeep<VibefireEventT>,
  ) => void,
  showStatusBanner?: boolean,
) => {
  return useCallback(
    ({ item: event }: ListRenderItemInfo<PartialDeep<VibefireEventT>>) => (
      <EventCard
        published={event.published!}
        eventInfo={{
          bannerImgKey: event.images?.banner ?? undefined,
          title: event.title!,
          organiserId: event.organiserId!,
          organiserType: event.organiserType!,
          organiserName: event.organiserName!,
          addressDescription: event?.location?.addressDescription ?? undefined,
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
    ),
    [onEventCrossPress, onEventPress, showStatusBanner],
  );
};

const useNoEventsText = (noEventsMessage?: string) => {
  return useMemo(() => {
    return (
      <View className="h-[30vh] items-center justify-center">
        <Text className="text-lg font-bold text-black">
          {noEventsMessage ? noEventsMessage : "No events here yet"}
        </Text>
      </View>
    );
  }, [noEventsMessage]);
};

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
  const sortedEvents = useSortedEvents(events, { sortAsc });

  const renderItem = useEventCardRenderer(
    onEventPress,
    onEventCrossPress,
    showStatusBanner,
  );
  const noEventsText = useNoEventsText(noEventsMessage);

  const header = useMemo(() => {
    return <Text className="text-2xl font-bold text-black">{listTitle}</Text>;
  }, [listTitle]);

  const itemSep = useItemSeparator();

  return (
    <FlatListViewSheet
      ListEmptyComponent={noEventsText}
      ListHeaderComponent={listTitle ? header : undefined}
      ItemSeparatorComponent={itemSep}
      data={sortedEvents}
      contentContainerStyle={{ padding: 5 }}
      renderItem={renderItem}
      keyExtractor={(item) => item.id!}
    />
  );
};

export const EventsListWithSections = ({
  events,
  upcomingEvents,
  onEventPress,
  onEventCrossPress,
  noEventsMessage,
  showStatusBanner = false,
  sortAsc = true,
}: EventsListProps & { upcomingEvents: EventsListProps["events"] }) => {
  const sortedEvents = useSortedEvents(events, { sortAsc });
  const sortedUpcomingEvents = useSortedEvents(upcomingEvents, { sortAsc });

  const sections = useMemo(() => {
    const r = [];
    if (sortedUpcomingEvents.length > 0) {
      r.push({
        title: "Upcoming Events",
        data: sortedUpcomingEvents,
      });
    }
    if (sortedEvents.length > 0) {
      r.push({
        title: "All Events",
        data: sortedEvents,
      });
    }
    return r;
  }, [sortedEvents, sortedUpcomingEvents]);

  const renderSectionHeader = useCallback(
    ({ section }: { section: { title: string } }) => (
      <View className="p-2">
        <Text className="text-lg font-bold text-black">{section.title}</Text>
      </View>
    ),
    [],
  );
  const renderItem = useEventCardRenderer(
    onEventPress,
    onEventCrossPress,
    showStatusBanner,
  );
  const noEventsText = useNoEventsText(noEventsMessage);

  const itemSep = useItemSeparator();

  return (
    <SectionListViewSheet
      ListEmptyComponent={noEventsText}
      ItemSeparatorComponent={itemSep}
      contentContainerStyle={{ padding: 5 }}
      sections={sections}
      renderSectionHeader={renderSectionHeader}
      stickyHeaderHiddenOnScroll={true}
      stickySectionHeadersEnabled={false}
      renderItem={renderItem}
      keyExtractor={(item) => item.id!}
    />
  );
};

const useEventChipRenderer = (onPress: (eventLinkId: string) => void) => {
  return useCallback(
    (event: PartialDeep<VibefireEventT>) => (
      <EventChip
        eventLinkId={event.linkId!}
        eventInfo={{
          title: event.title!,
          bannerImgKey: event?.images?.banner,
          timeStartIsoNTZ: event.timeStartIsoNTZ,
          state: event.state!,
        }}
        onPress={onPress}
      />
    ),
    [onPress],
  );
};

type EventsListSimpleChipViewProps = {
  events: PartialDeep<VibefireEventT>[];
  onPress: (eventLinkId: string) => void;
  noEventsMessage?: string;
  latestFirst?: boolean;
  limit?: number;
};

export const EventsListSimpleChipView = ({
  events,
  onPress,
  noEventsMessage,
  latestFirst = true,
  limit = 4,
}: EventsListSimpleChipViewProps) => {
  const sortedEvents = useSortedEvents(events, {
    sortAsc: !latestFirst,
    sliceCount: limit,
  });

  const noEventsText = useNoEventsText(noEventsMessage);

  const renderEventChip = useEventChipRenderer(onPress);

  return (
    <SimpleList
      items={sortedEvents}
      itemRenderer={renderEventChip}
      noItemsComponent={noEventsText}
      styleOpts={{ separatorHeight: 4 }}
    />
  );
};
