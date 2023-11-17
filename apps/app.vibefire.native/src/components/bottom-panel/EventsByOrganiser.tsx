import React, { forwardRef, type Ref } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { EventsList } from "~/components/event/EventList";
import { trpc } from "~/apis/trpc-client";
import {
  navCreateEvent,
  navEditEvent,
  navManageEvent,
  navOwnEventsByOrganiserClose,
} from "~/nav";
import {
  ErrorSheet,
  LoadingSheet,
  ScrollViewSheetWithHeader,
  useSheetBackdrop,
} from "./_shared";

const EventsByOrganiserView: React.FC<{
  events: PartialDeep<VibefireEventT>[];
}> = ({ events }) => {
  return (
    <ScrollViewSheetWithHeader header="Your Events">
      <View className="flex-col items-center justify-center space-y-4 px-2 py-4">
        <TouchableOpacity
          className="rounded-lg bg-black px-4 py-4"
          onPress={() => {
            navCreateEvent();
          }}
        >
          <Text className="text-xl font-bold text-white">Create event</Text>
        </TouchableOpacity>

        <View>
          <EventsList
            events={events}
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
      </View>
    </ScrollViewSheetWithHeader>
  );
};

const EventsByOrganiserController = () => {
  const eventsQuery = trpc.events.eventsByOrganiser.useQuery({});

  switch (eventsQuery.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="Failed to load events" />;
    case "success":
      return <EventsByOrganiserView events={eventsQuery.data} />;
  }
};

const EventsByOrganiserComponent = (
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  _props,
  ref: Ref<BottomSheetModalMethods>,
) => {
  const insets = useSafeAreaInsets();
  const backdrop = useSheetBackdrop();

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={backdrop}
      stackBehavior="push"
      backgroundStyle={{
        backgroundColor: "rgba(255,255,255,1)",
      }}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={["80%"]}
      onDismiss={() => {
        navOwnEventsByOrganiserClose();
      }}
    >
      <EventsByOrganiserController />
    </BottomSheetModal>
  );
};

export const EventsByOrganiser = forwardRef(EventsByOrganiserComponent);
