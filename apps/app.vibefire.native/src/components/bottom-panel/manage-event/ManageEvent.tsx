import { forwardRef, useEffect, useMemo, useState, type Ref } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

import { navManageEventClose } from "~/nav";
import { LoadingSheet } from "../_shared";
import { ManageEventCreate } from "./views/ManageEventCreate";
import { ManageEventEdit } from "./views/ManageEventEdit";
import { ManageEventManagement } from "./views/ManageEventManagement";

type ManageEventViewLoading = {
  state: "loading";
};
type ManageEventViewError = {
  state: "error";
};
type ManageEventViewCreate = {
  state: "create";
};
type ManageEventViewEdit = {
  state: "edit";
  eventId: string;
  formSelect:
    | "description"
    | "location"
    | "times"
    | "images"
    | "review"
    | "timeline";
};
type ManageEventViewManage = {
  state: "manage";
  eventId: string;
};
type ManageEventViewState =
  | ManageEventViewLoading
  | ManageEventViewError
  | ManageEventViewCreate
  | ManageEventViewEdit
  | ManageEventViewManage;

const _ViewControl = (props: { manageSelect?: string }) => {
  const { manageSelect } = props;

  const [viewState, setViewState] = useState<ManageEventViewState>({
    state: "loading",
  });

  useEffect(() => {
    if (!manageSelect) {
      return;
    }
    const selectParts = manageSelect.split(",", 3);
    const eventIdOrCreate = selectParts[0];

    const isCreate = eventIdOrCreate === "create";
    const isEdit = selectParts[1] === "edit";

    if (isCreate) {
      setViewState({ state: "create" });
    } else if (isEdit) {
      const formSelect = selectParts[2];
      if (
        formSelect === "description" ||
        formSelect === "location" ||
        formSelect === "times" ||
        formSelect === "images" ||
        formSelect === "review" ||
        formSelect === "timeline"
      ) {
        setViewState({ state: "edit", eventId: eventIdOrCreate, formSelect });
      } else {
        console.error(`Invalid formSelect value: ${formSelect}`);
      }
    } else {
      setViewState({ state: "manage", eventId: eventIdOrCreate });
    }
  }, [manageSelect]);

  switch (viewState.state) {
    case "loading":
      return <LoadingSheet />;
    case "create":
      return <ManageEventCreate />;
    case "edit":
      return (
        <ManageEventEdit
          eventId={viewState.eventId}
          formSelect={viewState.formSelect}
        />
      );
    case "manage":
      return <ManageEventManagement eventId={viewState.eventId} />;
  }
};

const _PreControl = (
  props: { manageSelect?: string },
  ref: Ref<BottomSheetModalMethods>,
) => {
  const insets = useSafeAreaInsets();

  return (
    <BottomSheetModal
      ref={ref}
      backgroundStyle={{
        backgroundColor: "rgba(255,255,255,0.9)",
      }}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={["80%"]}
      onDismiss={() => {
        navManageEventClose();
      }}
    >
      <_ViewControl manageSelect={props.manageSelect} />
    </BottomSheetModal>
  );
};

export const ManageEvent = forwardRef(_PreControl);
