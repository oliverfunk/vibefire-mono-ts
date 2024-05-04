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
import { ErrorDisplay, LoadingDisplay } from "!/components/misc/errors-loading";
import { withSuspenseErrorBoundary } from "!/components/misc/SuspenseWithError";
import { SummaryCompStructure } from "!/components/structural/SummaryComponent";
import { navCreateEvent, navManageEvent, navViewEvent } from "!/nav";

export const UsersEventsSummary = () => {
  const EventsListSuspense = withSuspenseErrorBoundary(
    () => {
      const [eventsByUser] = trpc.events.eventsByUser.useSuspenseQuery({});

      return (
        <View className="px-2 py-4">
          <EventsListSimpleChipView
            events={eventsByUser}
            onPress={navManageEvent}
          />
        </View>
      );
    },
    {
      ErrorFallback: ({ error, resetErrorBoundary }) => (
        <ErrorDisplay
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          error={error}
          resetErrorBoundary={resetErrorBoundary}
          textWhite={true}
        />
      ),
      LoadingFallback: LoadingDisplay({ loadingWhite: true }),
    },
  );

  return (
    <SummaryCompStructure
      headerTitle="Your Events"
      onHeaderButtonPress={navCreateEvent}
    >
      <EventsListSuspense />
    </SummaryCompStructure>
  );
};

export const EventsQueryListSheet = () => {
  const [upcomingEvents] = useAtom(upcomingEventsQueryResultAtom);
  const [mapPosDateEvents] = useAtom(mapPositionDateEventsQueryResultAtom);

  return (
    <EventsListWithSections
      events={mapPosDateEvents}
      upcomingEvents={upcomingEvents}
      onEventPress={(_eventId, event) => {
        navViewEvent(event.linkId!);
      }}
    />
  );
};
