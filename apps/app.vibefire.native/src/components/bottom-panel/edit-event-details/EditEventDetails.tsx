import { useMemo } from "react";
import _ from "lodash";

import { type VibefireEventT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { ErrorSheet, LoadingSheet } from "../_shared";
import { EditEventForm } from "./EditEventDetailsForm";

const EditEventController = (props: { eventId: string; section?: string }) => {
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

export const EditEventDetails = (props: {
  linkId: string;
  section?: string;
}) => {
  const { linkId: eventId, section } = props;

  return <EditEventController eventId={eventId} section={section} />;
};
