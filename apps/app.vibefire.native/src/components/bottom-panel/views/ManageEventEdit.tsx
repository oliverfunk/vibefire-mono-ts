import { type VibefireEventT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { ErrorSheet, LoadingSheet } from "../_shared";
import { ManageEventEditDescriptionsForm } from "./ManageEventEditDescriptionsForm";
import { ManageEventEditLocationForm } from "./ManageEventEditLocationForm";
import { ManageEventEditTimesForm } from "./ManageEventEditTimesForm";

export const ManageEventEdit = (props: {
  eventId: string;
  formSelect: "description" | "location" | "times";
}) => {
  const { eventId, formSelect } = props;
  const eventForManagement = trpc.events.eventForManagement.useQuery({
    eventId,
  });

  switch (eventForManagement.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="Couldn't load the event" />;
    case "success":
      switch (formSelect) {
        case "description":
          return (
            <ManageEventEditDescriptionsForm
              eventId={eventId}
              currentEventData={
                eventForManagement.data as Partial<VibefireEventT> | undefined
              }
              dataRefetch={eventForManagement.refetch}
            />
          );
        case "location":
          return (
            <ManageEventEditLocationForm
              eventId={eventId}
              currentEventData={
                eventForManagement.data as Partial<VibefireEventT> | undefined
              }
              dataRefetch={eventForManagement.refetch}
            />
          );
        case "times":
          return (
            <ManageEventEditTimesForm
              eventId={eventId}
              currentEventData={
                eventForManagement.data as Partial<VibefireEventT> | undefined
              }
              dataRefetch={eventForManagement.refetch}
            />
          );
        default:
          return (
            <ManageEventEditDescriptionsForm
              eventId={eventId}
              currentEventData={
                eventForManagement.data as Partial<VibefireEventT> | undefined
              }
              dataRefetch={eventForManagement.refetch}
            />
          );
      }
  }
};
