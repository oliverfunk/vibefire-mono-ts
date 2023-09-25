import { type VibefireEventT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { ErrorSheet, LoadingSheet } from "../_shared";
import { ManageEventEditDescriptionsForm } from "./ManageEventEditDescriptionsForm";
import { ManageEventEditImagesForm } from "./ManageEventEditImagesForm";
import { ManageEventEditLocationForm } from "./ManageEventEditLocationForm";
import { ManageEventEditReview } from "./ManageEventEditReview";
import { ManageEventEditTimesForm } from "./ManageEventEditTimesForm";

export const ManageEventEdit = (props: {
  eventId: string;
  formSelect: "description" | "location" | "times" | "images" | "review";
}) => {
  const { eventId, formSelect } = props;
  const eventForEdit = trpc.events.eventForEdit.useQuery({
    eventId,
  });

  switch (eventForEdit.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="Couldn't load the event" />;
    case "success":
      const eventData = eventForEdit.data as Partial<VibefireEventT>;
      switch (formSelect) {
        case "description":
          return (
            <ManageEventEditDescriptionsForm
              eventId={eventId}
              currentEventData={eventData}
              dataRefetch={eventForEdit.refetch}
            />
          );
        case "location":
          return (
            <ManageEventEditLocationForm
              eventId={eventId}
              currentEventData={eventData}
              dataRefetch={eventForEdit.refetch}
            />
          );
        case "times":
          return (
            <ManageEventEditTimesForm
              eventId={eventId}
              currentEventData={eventData}
              dataRefetch={eventForEdit.refetch}
            />
          );
        case "images":
          return (
            <ManageEventEditImagesForm
              eventId={eventId}
              currentEventData={eventData}
              dataRefetch={eventForEdit.refetch}
            />
          );
        case "review":
          return (
            <ManageEventEditReview
              eventId={eventId}
              currentEventData={eventData}
              dataRefetch={eventForEdit.refetch}
            />
          );
      }
  }
};
