import { useMemo } from "react";
import _ from "lodash";

import { type VibefireEventT } from "@vibefire/models";

import { trpc } from "~/apis/trpc-client";
import { ErrorSheet, LoadingSheet } from "../../utils/sheet-utils";
import { EditEventForm } from "./EditEventDetailsForm";

const EditEventController = (props: { linkId: string; section?: string }) => {
  const { linkId, section } = props;

  const eventForEdit = trpc.events.eventForEdit.useQuery({
    linkId,
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
    case "pending":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="Couldn't load the event" />;
    case "success":
      const currentEventData = eventForEdit.data;
      return (
        <EditEventForm
          eventId={currentEventData.id!}
          linkId={linkId}
          section={selectedSection}
          currentEventData={currentEventData}
          dataRefetch={eventForEdit.refetch}
        />
      );
  }
};

export const EditEventDetails = (props: {
  linkId: string;
  section?: string;
}) => {
  const { linkId, section } = props;

  return <EditEventController linkId={linkId} section={section} />;
};
