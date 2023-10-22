import { useEffect, useLayoutEffect, useRef } from "react";
import {
  BottomSheetModalProvider,
  type BottomSheetModal,
} from "@gorhom/bottom-sheet";

import { EventDetails } from "./modals/EventDetails";
import { EventsByOrganiser } from "./modals/EventsByOrganiser";
import { EventsListAndProfile } from "./modals/EventsListAndProfile";
import { ManageEvent } from "./modals/ManageEvent";
import { OrgDetails } from "./modals/OrgDetails";

export const BottomPanel = (props: {
  eventID?: string;
  orgID?: string;
  manageEvent?: string;
  eventsBy?: string;
}) => {
  const mapQueryEventsListSheetRef = useRef<BottomSheetModal>(null);
  const eventDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);
  const orgDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);
  const manageEventSheetRef = useRef<BottomSheetModal>(null);
  const eventsBySheetRef = useRef<BottomSheetModal>(null);

  //#region effects
  useEffect(() => {
    if (props.eventID) {
      // navigate to event on map and show event details
      eventDetailsDisplaySheetRef.current?.present();
    } else if (props.orgID) {
      // show org details screen
      orgDetailsDisplaySheetRef.current?.present();
    } else if (props.manageEvent) {
      manageEventSheetRef.current?.present();
    } else if (props.eventsBy) {
      eventsBySheetRef.current?.present();
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
          manageSelect={props.manageEvent}
        />
      )}
      {props.eventsBy && <EventsByOrganiser ref={eventsBySheetRef} />}
    </BottomSheetModalProvider>
  );
};
