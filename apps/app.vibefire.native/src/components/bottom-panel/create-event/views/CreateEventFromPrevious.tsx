import React from "react";
import { View } from "react-native";
import { useBottomSheet } from "@gorhom/bottom-sheet";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { EventsList } from "~/components/event/EventList";
import { trpc } from "~/apis/trpc-client";
import { navEditEvent } from "~/nav";
import {
  ErrorSheet,
  LoadingSheet,
  ScrollViewSheet,
  SectionHeader,
} from "../../_shared";

const CreateEventFromPreviousView = (props: {
  events: PartialDeep<VibefireEventT>[];
}) => {
  const { events } = props;

  const { close } = useBottomSheet();

  const createEventFromPreviousMut =
    trpc.events.createEventFromPrevious.useMutation();

  return (
    <ScrollViewSheet>
      <SectionHeader text="Tap to select the event you want to copy and create a new event from" />
      <View className="flex-col items-center justify-center space-y-4 px-2">
        <EventsList
          events={events}
          noEventsMessage="You have made no events yet"
          onEventPress={async (eventId, _event) => {
            const { id: createdId } =
              await createEventFromPreviousMut.mutateAsync({
                eventId,
              });
            close();
            navEditEvent(createdId);
          }}
          showStatusBanner={true}
          sortAsc={false}
        />
      </View>
    </ScrollViewSheet>
  );
};

export const CreateEventFromPreviousController = () => {
  const eventsQuery = trpc.events.eventsByUser.useQuery({});

  switch (eventsQuery.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="Failed to load events" />;
    case "success":
      return <CreateEventFromPreviousView events={eventsQuery.data} />;
  }
};
