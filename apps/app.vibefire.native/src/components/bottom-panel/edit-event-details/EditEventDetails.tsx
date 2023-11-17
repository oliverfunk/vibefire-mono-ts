import { forwardRef, useMemo, type Ref } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import _ from "lodash";

import { type VibefireEventT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { navEditEventClose } from "~/nav";
import { ErrorSheet, LoadingSheet } from "../_shared";
import { CreateEventForm } from "./CreateEventForm";
import { EditEventForm } from "./EditEventDetailsForm";

const EditEventController = (props: { eventId: string; section: string }) => {
  const { eventId, section } = props;

  const eventForEdit = trpc.events.eventForEdit.useQuery({
    eventId,
  });

  const selectedSection = useMemo(() => {
    switch (section) {
      case "description":
        return "description";
      case "location":
        return "location";
      case "times":
        return "times";
      case "images":
        return "images";
      case "timeline":
        return "timeline";
      default:
        return "description";
    }
  }, [section]);

  switch (eventForEdit.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="Couldn't load the event" />;
    case "success":
      const currentEventData = eventForEdit.data as Partial<VibefireEventT>;
      return (
        <EditEventForm
          section={selectedSection}
          currentEventData={currentEventData}
          eventId={eventId}
          dataRefetch={eventForEdit.refetch}
        />
      );
  }
};

const _EditEventDetails = (
  props: { queryString: string },
  ref: Ref<BottomSheetModalMethods>,
) => {
  const { queryString } = props;
  const insets = useSafeAreaInsets();

  const [eventId, section] = queryString.split(",", 2);

  return (
    <BottomSheetModal
      ref={ref}
      stackBehavior="push"
      backgroundStyle={{
        backgroundColor: "rgba(255,255,255,1)",
      }}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={["80%"]}
      onDismiss={() => {
        navEditEventClose();
      }}
    >
      {eventId === "create" ? (
        <CreateEventForm />
      ) : (
        <EditEventController eventId={eventId} section={section} />
      )}
    </BottomSheetModal>
  );
};

export const EditEventDetails = forwardRef(_EditEventDetails);
