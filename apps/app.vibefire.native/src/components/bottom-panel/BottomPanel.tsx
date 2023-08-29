import { useEffect, useLayoutEffect, useRef } from "react";
import {
  BottomSheetModalProvider,
  type BottomSheetModal,
} from "@gorhom/bottom-sheet";

import { EventDetails } from "./modals/EventDetails";
import { EventsListAndProfile } from "./modals/EventsListAndProfile";
import { OrgDetails } from "./modals/OrgDetails";

export const BottomPanel = (props: { eventID?: string; orgID?: string }) => {
  const mapQueryEventsListSheetRef = useRef<BottomSheetModal>(null);
  const eventDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);
  const orgDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);

  //#region effects
  useEffect(() => {
    if (props.eventID) {
      // navigate to event on map and show event details
      eventDetailsDisplaySheetRef.current?.present();
    } else if (props.orgID) {
      // show org details screen
      orgDetailsDisplaySheetRef.current?.present();
    }
  }, [props]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => mapQueryEventsListSheetRef.current?.present());
  }, []);
  //#endregion

  return (
    <BottomSheetModalProvider>
      <EventsListAndProfile ref={mapQueryEventsListSheetRef} />
      <EventDetails ref={eventDetailsDisplaySheetRef} eventId={props.eventID} />
      <OrgDetails
        ref={orgDetailsDisplaySheetRef}
        organisationId={props.orgID}
      />
    </BottomSheetModalProvider>
  );
};
