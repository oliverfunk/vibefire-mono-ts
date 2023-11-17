import { forwardRef, type Ref } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { trpc } from "~/apis/trpc-client";
import { navManageEventClose } from "~/nav";
import { ErrorSheet, LoadingSheet } from "../_shared";
import { ManagementView } from "./views/ManageEventView";

const ManageEventController = (props: { eventId: string; section: string }) => {
  const { eventId, section } = props;

  const eventForManagement = trpc.events.eventAllInfoForManagement.useQuery({
    eventId,
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

const _ManageEvent = (
  props: { queryString: string },
  ref: Ref<BottomSheetModalMethods>,
) => {
  const { queryString } = props;
  const insets = useSafeAreaInsets();

  const [eventId, section] = queryString.split(",", 2);

  return (
    <BottomSheetModal
      ref={ref}
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
      <ManageEventController eventId={eventId} section={section} />
    </BottomSheetModal>
  );
};

export const ManageEvent = forwardRef(_ManageEvent);
