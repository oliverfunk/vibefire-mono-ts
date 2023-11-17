import { useEffect, useLayoutEffect, useRef } from "react";
import {
  BottomSheetModalProvider,
  type BottomSheetModal,
} from "@gorhom/bottom-sheet";

import { EditEventDetails } from "./edit-event-details/EditEventDetails";
import { EventDetails } from "./EventDetails";
import { EventsByOrganiser } from "./EventsByOrganiser";
import { EventsListAndProfile } from "./EventsListAndProfile";
import { ManageEvent } from "./manage-event/ManageEvent";
import { OrgDetails } from "./OrgDetails";

export const BottomPanel = (props: {
  eventID?: string;
  orgID?: string;
  manageEvent?: string;
  eventsBy?: string;
  editEvent?: string;
}) => {
  const mapQueryEventsListSheetRef = useRef<BottomSheetModal>(null);
  const eventDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);
  const orgDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);
  const manageEventSheetRef = useRef<BottomSheetModal>(null);
  const eventsByOrganiserSheetRef = useRef<BottomSheetModal>(null);
  const editEventDetailsSheetRef = useRef<BottomSheetModal>(null);

  //#region effects
  useEffect(() => {
    if (props.eventID) {
      // navigate to event on map and show event details
      eventDetailsDisplaySheetRef.current?.present();
    }
    if (props.orgID) {
      // show org details screen
      orgDetailsDisplaySheetRef.current?.present();
    }
    if (props.manageEvent) {
      manageEventSheetRef.current?.present();
    }
    if (props.editEvent) {
      editEventDetailsSheetRef.current?.present();
    }
    if (props.eventsBy) {
      eventsByOrganiserSheetRef.current?.present();
    }
  }, [props]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => mapQueryEventsListSheetRef.current?.present());
  }, []);
  //#endregion

  return (
    <BottomSheetModalProvider>
      <EventsListAndProfile ref={mapQueryEventsListSheetRef} />
      {props.eventID && (
        <EventDetails
          ref={eventDetailsDisplaySheetRef}
          eventQuery={props.eventID}
        />
      )}
      {props.orgID && (
        <OrgDetails
          ref={orgDetailsDisplaySheetRef}
          organisationId={props.orgID}
        />
      )}
      {props.manageEvent && (
        <ManageEvent
          ref={manageEventSheetRef}
          queryString={props.manageEvent}
        />
      )}
      {props.eventsBy && <EventsByOrganiser ref={eventsByOrganiserSheetRef} />}
      {props.editEvent && (
        <EditEventDetails
          ref={editEventDetailsSheetRef}
          queryString={props.editEvent}
        />
      )}
    </BottomSheetModalProvider>
  );
};
