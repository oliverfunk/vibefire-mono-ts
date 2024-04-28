import { View } from "react-native";
import { useAtom } from "jotai";

import {
  mapPositionDateEventsQueryResultAtom,
  upcomingEventsQueryResultAtom,
} from "@vibefire/shared-state";

import { trpc } from "!/api/trpc-client";

import {
  EventsListSimpleChipView,
  EventsListWithSections,
} from "!/components/event/EventsList";
import { GroupsListSimpleChipView } from "!/components/group/GroupsList";
import { SummaryCompStructure } from "!/components/structural/SummaryComponent";
import {
  ErrorDisplay,
  LoadingDisplay,
} from "!/components/utils/errors-loading";
import {
  ErrorSheetSuspense,
  LoadingSheet,
} from "!/components/utils/sheet-utils";
import { withSuspenseErrorBoundary } from "!/components/utils/SuspenseWithError";
import { navCreateEvent, navManageEvent, navViewEvent } from "!/nav";

export const UsersEventsSummary = () => {
  const EventsListSuspense = withSuspenseErrorBoundary(
    () => {
      const [eventsByUser] = trpc.events.eventsByUser.useSuspenseQuery({});

      return (
        <EventsListSimpleChipView
          events={eventsByUser}
          onPress={navManageEvent}
        />
      );
    },
    {
      ErrorFallback: ({ error, resetErrorBoundary }) =>
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        ErrorDisplay({ error, resetErrorBoundary, textWhite: true }),
      LoadingFallback: LoadingDisplay({ loadingWhite: true }),
    },
  );

  return (
    <SummaryCompStructure
      headerTitle="Your Events"
      onHeaderButtonPress={navCreateEvent}
    >
      <View className="bg-black px-2 py-4">
        <EventsListSuspense />
      </View>
    </SummaryCompStructure>
  );
};

export const EventsQueryListSheet = () => {
  const [upcomingEvents] = useAtom(upcomingEventsQueryResultAtom);
  const [mapPosDateEvents] = useAtom(mapPositionDateEventsQueryResultAtom);

  return (
    <View className="flex-1">
      <EventsListWithSections
        events={mapPosDateEvents}
        upcomingEvents={upcomingEvents}
        onEventPress={(_eventId, event) => {
          navViewEvent(event.linkId!);
        }}
      />
    </View>
  );
};
