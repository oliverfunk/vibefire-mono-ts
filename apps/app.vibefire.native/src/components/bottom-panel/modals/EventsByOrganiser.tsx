import React, { forwardRef, useMemo, type Ref } from "react";
import { View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

import { EventsList } from "~/components/EventList";
import { trpc } from "~/apis/trpc-client";
import {
  navManageEvent,
  navManageEventEditReview,
  navViewEventsByOrganiserClose,
} from "~/nav";
import {
  ErrorSheet,
  LoadingSheet,
  ScrollViewSheetWithHeader,
  useSheetBackdrop,
} from "../_shared";

const EventsByOrganiserView: React.FC<{
  events: PartialDeep<VibefireEventT>[];
}> = ({ events }) => {
  return (
    <ScrollViewSheetWithHeader header="Your Events">
      <View className="px-2 py-5">
        <EventsList
          events={events}
          onEventPress={(eventId, event) => {
            if (event?.state === "ready") {
              navManageEvent(eventId);
            } else {
              navManageEventEditReview(eventId);
              // should nav to edit if in draft
            }
          }}
          showPublishedBanner={true}
        />
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
  const snapPoints = useMemo(() => ["80%"], []);

  const backdrop = useSheetBackdrop();

  return (
    <BottomSheetModal
      ref={ref}
      backdropComponent={backdrop}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={snapPoints}
      onDismiss={() => {
        navViewEventsByOrganiserClose();
      }}
    >
      <EventsByOrganiserController />
    </BottomSheetModal>
  );
};

export const EventsByOrganiser = forwardRef(EventsByOrganiserComponent);
