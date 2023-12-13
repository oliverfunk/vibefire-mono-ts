import { useEffect, useLayoutEffect, useRef } from "react";
import { Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import {
  BottomSheetModal,
  BottomSheetModalProvider,
} from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";

import { trpc } from "~/apis/trpc-client";
import { mainBottomSheetPresentToggleAtom } from "~/atoms";
import {
  navCreateEventClose,
  navEditEventClose,
  navManageEventClose,
  navOwnEventsByOrganiserClose,
  navViewEventClose,
} from "~/nav";
import { type NavMainQueryParamsT } from "~/types";
import { CreateEventForm } from "./create-event/CreateEvent";
import { EditEventDetails } from "./edit-event-details/EditEventDetails";
import { EventDetails } from "./EventDetails";
import { EventsByOrganiser } from "./EventsByOrganiser";
import { EventsListAndProfile } from "./EventsListAndProfile";
import { HandleWithHeader } from "./HandleWithHeader";
import { ManageEvent } from "./manage-event/ManageEvent";
import { OrgDetails } from "./OrgDetails";

export const BottomPanel = (props: NavMainQueryParamsT) => {
  const utils = trpc.useUtils();

  const mapQueryEventsListSheetRef = useRef<BottomSheetModal>(null);
  const eventDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);
  const orgDetailsDisplaySheetRef = useRef<BottomSheetModal>(null);
  const manageEventSheetRef = useRef<BottomSheetModal>(null);
  const eventsByOrganiserSheetRef = useRef<BottomSheetModal>(null);
  const editEventDetailsSheetRef = useRef<BottomSheetModal>(null);
  const createEventSheetRef = useRef<BottomSheetModal>(null);

  const [mainBottomSheetPresentToggle] = useAtom(
    mainBottomSheetPresentToggleAtom,
  );

  //#region effects
  useEffect(() => {
    if (props.eventID !== undefined) {
      eventDetailsDisplaySheetRef.current?.present();
    } else {
      eventDetailsDisplaySheetRef.current?.close();
    }

    // if (props.orgID !== undefined) {
    //   orgDetailsDisplaySheetRef.current?.present();
    // } else {
    //   orgDetailsDisplaySheetRef.current?.close();
    // }

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

    if (props.create !== undefined) {
      createEventSheetRef.current?.present();
    } else {
      createEventSheetRef.current?.close();
    }
  }, [props]);

  useEffect(() => {
    if (!mainBottomSheetPresentToggle.initial) {
      if (mainBottomSheetPresentToggle.present) {
        mapQueryEventsListSheetRef.current?.present();
      } else {
        mapQueryEventsListSheetRef.current?.collapse();
      }
    }
  }, [mainBottomSheetPresentToggle]);

  useLayoutEffect(() => {
    requestAnimationFrame(() => mapQueryEventsListSheetRef.current?.present());
  }, []);
  //#endregion

  const insets = useSafeAreaInsets();

  const a = 89;

  return (
    <BottomSheetModalProvider>
      <EventsListAndProfile ref={mapQueryEventsListSheetRef} />

      {/* Event details */}
      <BottomSheetModal
        ref={eventDetailsDisplaySheetRef}
        // backdropComponent={backdrop}
        keyboardBehavior="extend"
        stackBehavior="push"
        backgroundStyle={{
          backgroundColor: "black",
        }}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={["80%"]}
        handleComponent={null}
        onDismiss={async () => {
          navViewEventClose();
          await utils.invalidate();
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

      {/* Events by organiser */}
      <BottomSheetModal
        ref={eventsByOrganiserSheetRef}
        // backdropComponent={backdrop}
        handleComponent={(p) =>
          HandleWithHeader({ header: "Your Events", ...p })
        }
        // enablePanDownToClose={true}
        // enableHandlePanningGesture={true}
        // enableContentPanningGesture={Platform.OS === "android" ? false : true}
        stackBehavior="push"
        backgroundStyle={{
          backgroundColor: "rgba(255,255,255,1)",
        }}
        enablePanDownToClose={Platform.OS === "android" ? false : true}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={["80%"]}
        onDismiss={async () => {
          navOwnEventsByOrganiserClose();
          await utils.invalidate();
        }}
      >
        {props.eventsBy && <EventsByOrganiser />}
      </BottomSheetModal>

      {/* Manage event */}
      <BottomSheetModal
        ref={manageEventSheetRef}
        handleComponent={(p) =>
          HandleWithHeader({ header: "Manage Event", ...p })
        }
        enablePanDownToClose={Platform.OS === "android" ? false : true}
        // backdropComponent={backdrop}
        stackBehavior="push"
        backgroundStyle={{
          backgroundColor: "rgba(255,255,255,1)",
        }}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={["80%"]}
        onDismiss={async () => {
          navManageEventClose();
          await utils.invalidate();
        }}
      >
        {props.manageEvent && <ManageEvent queryString={props.manageEvent} />}
      </BottomSheetModal>

      {/* Event edit */}
      <BottomSheetModal
        ref={editEventDetailsSheetRef}
        // backdropComponent={backdrop}
        handleComponent={(p) =>
          HandleWithHeader({ header: "Edit Event", ...p })
        }
        // enableContentPanningGesture={false}
        enablePanDownToClose={Platform.OS === "android" ? false : true}
        stackBehavior="push"
        backgroundStyle={{
          backgroundColor: "rgba(255,255,255,1)",
        }}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={["80%"]}
        onDismiss={async () => {
          navEditEventClose();
          await utils.invalidate();
        }}
      >
        {props.editEvent && <EditEventDetails queryString={props.editEvent} />}
      </BottomSheetModal>

      {/* Create edit */}
      <BottomSheetModal
        ref={createEventSheetRef}
        // backdropComponent={backdrop}
        handleComponent={(p) =>
          HandleWithHeader({ header: "Create Event", ...p })
        }
        enablePanDownToClose={Platform.OS === "android" ? false : true}
        stackBehavior="push"
        backgroundStyle={{
          backgroundColor: "rgba(255,255,255,1)",
        }}
        bottomInset={insets.bottom}
        index={0}
        snapPoints={["80%"]}
        onDismiss={async () => {
          navCreateEventClose();
          await utils.invalidate();
        }}
      >
        {props.create && <CreateEventForm />}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};
