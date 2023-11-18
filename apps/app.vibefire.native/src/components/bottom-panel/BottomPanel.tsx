import { useEffect, useLayoutEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";

import { usePrevious } from "~/hooks/usePrevious";
import {
  navEditEventClose,
  navManageEventClose,
  navOwnEventsByOrganiserClose,
  navViewEventClose,
} from "~/nav";
import { useSheetBackdrop } from "./_shared";
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
    if (props.eventID !== undefined) {
      eventDetailsDisplaySheetRef.current?.present();
    } else {
      eventDetailsDisplaySheetRef.current?.close();
    }

    if (props.orgID !== undefined) {
      orgDetailsDisplaySheetRef.current?.present();
    } else {
      orgDetailsDisplaySheetRef.current?.close();
    }

    if (props.manageEvent !== undefined) {
      manageEventSheetRef.current?.present();
    } else {
      manageEventSheetRef.current?.close();
    }

    if (props.editEvent !== undefined) {
      editEventDetailsSheetRef.current?.present();
    } else {
      editEventDetailsSheetRef.current?.close();
    }

    if (props.eventsBy !== undefined) {
      eventsByOrganiserSheetRef.current?.present();
    } else {
      eventsByOrganiserSheetRef.current?.close();
    }
  }, [props]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => mapQueryEventsListSheetRef.current?.present());
  }, []);
  //#endregion

  const insets = useSafeAreaInsets();
  const backdrop = useSheetBackdrop();

  return (
    <BottomSheetModalProvider>
      <EventsListAndProfile ref={mapQueryEventsListSheetRef} />

      {/* Event details */}
      <BottomSheetModal
        ref={eventDetailsDisplaySheetRef}
        stackBehavior="push"
        backgroundStyle={{
          backgroundColor: "black",
        }}
        backdropComponent={backdrop}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={["80%"]}
        handleComponent={null}
        onDismiss={() => {
          navViewEventClose();
        }}
      >
        {props.eventID && <EventDetails eventQuery={props.eventID} />}
      </BottomSheetModal>

      {props.orgID && (
        <OrgDetails
          ref={orgDetailsDisplaySheetRef}
          organisationId={props.orgID}
        />
      )}

      {/* Manage event */}
      <BottomSheetModal
        ref={manageEventSheetRef}
        stackBehavior="push"
        backgroundStyle={{
          backgroundColor: "rgba(255,255,255,1)",
        }}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={["80%"]}
        onDismiss={() => {
          navManageEventClose();
        }}
      >
        {props.manageEvent && <ManageEvent queryString={props.manageEvent} />}
      </BottomSheetModal>

      {/* Events by organiser */}
      <BottomSheetModal
        ref={eventsByOrganiserSheetRef}
        backdropComponent={backdrop}
        stackBehavior="push"
        backgroundStyle={{
          backgroundColor: "rgba(255,255,255,1)",
        }}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={["80%"]}
        onDismiss={() => {
          navOwnEventsByOrganiserClose();
        }}
      >
        {props.eventsBy && <EventsByOrganiser />}
      </BottomSheetModal>

      {/* Event edit */}
      <BottomSheetModal
        ref={editEventDetailsSheetRef}
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
        {props.editEvent && <EditEventDetails queryString={props.editEvent} />}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
