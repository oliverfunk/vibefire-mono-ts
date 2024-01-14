import React, { useState } from "react";
import { Modal, Pressable, Text, TouchableOpacity, View } from "react-native";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { EventsList } from "~/components/event/EventList";
import { trpc } from "~/apis/trpc-client";
import { navEditEvent, navManageEvent } from "~/nav";
import { ErrorSheet, LoadingSheet, ScrollViewSheet } from "./_shared";

const DeleteConfirmationModal = (props: {
  showModal: boolean;
  hideModal: () => void;
  eventId?: string;
}) => {
  const { showModal, hideModal, eventId } = props;

  const utils = trpc.useUtils();

  const deleteEventMut = trpc.events.deleteEvent.useMutation();

  return (
    <Modal visible={showModal} transparent animationType="fade">
      <Pressable
        className="h-full w-full items-center justify-center bg-black/50 p-4"
        onPress={() => hideModal()}
      >
        <View className="flex-col space-y-4 overflow-hidden rounded bg-white p-4">
          <Text className="text-xl font-bold">Delete Event</Text>
          <Text className="text-base">
            {"Are you sure you want to delete the event?"}
          </Text>
          <View className="flex-col items-end space-y-2">
            <TouchableOpacity
              onPress={async () => {
                if (!eventId) return;
                await deleteEventMut.mutateAsync({ eventId });
                await utils.invalidate();
                hideModal();
              }}
            >
              <Text className="text-base font-bold text-red-500">Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
};

const EventsByOrganiserView = (props: {
  events: PartialDeep<VibefireEventT>[];
}) => {
  const { events } = props;

  const [showModalUsingEventId, setShowModalUsingEventId] = useState<
    string | undefined
  >(undefined);

  return (
    <View className="flex-1 pt-2">
      <DeleteConfirmationModal
        showModal={!!showModalUsingEventId}
        hideModal={() => setShowModalUsingEventId(undefined)}
        eventId={showModalUsingEventId}
      />
      <EventsList
        events={events}
        noEventsMessage="You have made no events yet"
        onEventPress={(_eventId, event) => {
          if (event?.state === "draft") {
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
