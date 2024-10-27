import { Text, View } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useAtom } from "jotai";

import { mapDisplayableEventsAtom } from "@vibefire/shared-state";

import { trpc } from "!/api/trpc-client";

import { IconButton } from "!/c/button/IconButton";
import { EventsList, EventsListSimpleChipView } from "!/c/event/EventsList";
import {
  ErrorDisplay,
  LoadingDisplay,
  withSuspenseErrorBoundary,
} from "!/c/misc/SuspenseWithError";
import { SummaryComponent } from "!/c/structural/SummaryComponent";
import {
  navCreateEvent,
  navManageEvent,
  navOwnEventsByOrganiser,
  navViewEvent,
} from "!/nav";

export const UsersEventsSummary = () => {
  const EventsListSuspense = withSuspenseErrorBoundary(
    () => {
      const [eventsByUser] = trpc.events.listSelfAll.useSuspenseQuery();

      if (!eventsByUser.ok) {
        throw eventsByUser.error;
      }

      return (
        <View className="flex-col">
          <EventsListSimpleChipView
            events={eventsByUser.value.data}
            onPress={navManageEvent}
          />
          <View className="items-start py-4">
            <IconButton
              onPress={navOwnEventsByOrganiser}
              useOpacity={true}
              size={1}
            >
              <View className="flex-row items-center justify-center rounded-sm bg-white/10 px-4 py-2">
                <FontAwesome name="eye" size={20} color="white" />
                <Text className="text-white"> View all</Text>
              </View>
            </IconButton>
          </View>
        </View>
      );
    },
    {
      ErrorFallback: ({ error, resetErrorBoundary }) => (
        <View className="p-5">
          <ErrorDisplay
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            error={error}
            resetErrorBoundary={resetErrorBoundary}
            textWhite={true}
          />
        </View>
      ),
      LoadingFallback: (
        <View className="p-5">
          <LoadingDisplay loadingWhite={true} />
        </View>
      ),
    },
  );

  return (
    <View className="bg-black px-2">
      <SummaryComponent
        headerTitle="Your Events"
        onHeaderButtonPress={navCreateEvent}
      >
        <EventsListSuspense />
      </SummaryComponent>
    </View>
  );
};

export const EventsQueryListSheet = () => {
  const [mapDisplayableEvents] = useAtom(mapDisplayableEventsAtom);

  return (
    <View className="h-full">
      <EventsList
        events={mapDisplayableEvents}
        noEventsMessage="No events in this area"
        onEventPress={(_eventId, event) => {
          navViewEvent(event.id!);
        }}
      />
    </View>
  );
};
