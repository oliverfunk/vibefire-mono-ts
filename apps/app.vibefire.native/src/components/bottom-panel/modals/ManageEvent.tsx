import { forwardRef, useEffect, useMemo, useState, type Ref } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";
import { useAtomValue } from "jotai";

import {
  manageEventSheetSnapIdxAtom,
  manageEventSheetSnapPointsAtom,
} from "~/atoms";
import { LoadingSheet, navManageEventClose } from "../_shared";
import { ManageEventCreate } from "../views/ManageEventCreate";
import { ManageEventEdit } from "../views/ManageEventEdit";

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
  formSelect: "description" | "location" | "times" | "images" | "review";
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
        formSelect === "review"
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
  }
};

const _PreControl = (
  props: { manageSelect?: string },
  ref: Ref<BottomSheetModalMethods>,
) => {
  const insets = useSafeAreaInsets();
  const snapPoints = useAtomValue(manageEventSheetSnapPointsAtom);
  const snapIdx = useAtomValue(manageEventSheetSnapIdxAtom);

  return (
    <BottomSheetModal
      ref={ref}
      bottomInset={insets.bottom}
      index={snapIdx}
      snapPoints={snapPoints}
      onDismiss={() => {
        navManageEventClose();
      }}
    >
      <_ViewControl manageSelect={props.manageSelect} />
    </BottomSheetModal>
  );
};

export const ManageEvent = forwardRef(_PreControl);
