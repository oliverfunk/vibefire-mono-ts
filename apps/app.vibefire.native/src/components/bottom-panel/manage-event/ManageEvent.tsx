import { trpc } from "~/apis/trpc-client";
import { ErrorSheet, LoadingSheet } from "../_shared";
import { ManagementView } from "./views/ManageEventView";

const ManageEventController = (props: { linkId: string; section?: string }) => {
  const { linkId, section } = props;

  const eventForManagement = trpc.events.eventAllInfoForManagement.useQuery({
    linkId,
  });

  switch (eventForManagement.status) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <ErrorSheet message="Couldn't load the event" />;
    case "success":
      return (
        <ManagementView
          event={eventForManagement.data.event}
          eventManagement={eventForManagement.data.eventManagement}
          dataRefetch={eventForManagement.refetch}
        />
      );
  }
};

export const ManageEvent = (props: { linkId: string; section?: string }) => {
  const { linkId, section } = props;

  return <ManageEventController linkId={linkId} section={section} />;
};
