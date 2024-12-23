import React, { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";

import { type TModelVibefireEvent } from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

import { trpc } from "!/api/trpc-client";

import { EventsFlashListSheet } from "!/c/event/EventsList";
import { ErrorSheet, LoadingSheet } from "!/c/misc/sheet-utils";
import { navEditEvent, navManageEvent } from "!/nav";

const EventsByOrganiserView = (props: {
  events: PartialDeep<TModelVibefireEvent>[];
}) => {
  const { events } = props;

  const [showModalUsingEventId, setShowModalUsingEventId] = useState<
    string | undefined
  >(undefined);

  return (
    <View className="flex-1">
      <DeleteConfirmationModal
        showModal={!!showModalUsingEventId}
        hideModal={() => setShowModalUsingEventId(undefined)}
        eventId={showModalUsingEventId}
      />
      <EventsFlashListSheet
        events={events}
        noEventsMessage="You have made no events yet"
        onEventPress={(_eventId, event) => {
          if (event?.state === 0) {
            navEditEvent(event.linkId!);
          } else {
            navManageEvent(event.linkId!);
          }
        }}
        onEventCrossPress={(eventId, _event) => {
          setShowModalUsingEventId(eventId);
        }}
        showStatusBanner={true}
        sortAsc={false}
      />
    </View>
  );
};

const EventsByOrganiserController = () => {
  const eventsQuery = trpc.events.eventsByUser.useQuery({});

  switch (eventsQuery.status) {
    case "pending":
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
