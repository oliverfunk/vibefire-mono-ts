import React from "react";
import { View } from "react-native";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { EventsList } from "~/components/event/EventList";
import { trpc } from "~/apis/trpc-client";
import { navEditEvent, navManageEvent } from "~/nav";
import { ErrorSheet, LoadingSheet, ScrollViewSheetWithHeader } from "./_shared";

const EventsByOrganiserView: React.FC<{
  events: PartialDeep<VibefireEventT>[];
}> = ({ events }) => {
  return (
    <ScrollViewSheetWithHeader header="Your Events">
      <View className="flex-col items-center justify-center space-y-4 px-2 py-4">
        <EventsList
          events={events}
          noEventsMessage="You have made no events yet"
          onEventPress={(eventId, event) => {
            if (event?.state === "draft") {
              navEditEvent(eventId);
            } else {
              navManageEvent(eventId);
            }
          }}
          showStatusBanner={true}
        />
      </View>
    </ScrollViewSheetWithHeader>
  );
};

const EventsByOrganiserController = () => {
  const eventsQuery = trpc.events.eventsByUser.useQuery({});

  switch (eventsQuery.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="Failed to load events" />;
    case "success":
      return <EventsByOrganiserView events={eventsQuery.data} />;
  }
};

export const EventsByOrganiser = () => {
  return <EventsByOrganiserController />;
};
