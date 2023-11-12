import { forwardRef, useCallback, useMemo, type Ref } from "react";
import { Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";
import { type BottomSheetModalMethods } from "@gorhom/bottom-sheet/lib/typescript/types";

// import { DateTime } from "luxon";

// import { SEARCH_HANDLE_HEIGHT, SearchHandle } from "../SearchHandle";

const _OrgDetails = (
  props: { organisationId?: string },
  ref: Ref<BottomSheetModalMethods>,
) => {
  const insets = useSafeAreaInsets();
  const snapPoints = useMemo(() => ["80%"], []);

  return (
    <BottomSheetModal
      ref={ref}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={snapPoints}
      onDismiss={() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        router.setParams({ profile: undefined });
      }}
    >
      <BottomSheetView>
        <Text>Hello</Text>
      </BottomSheetView>
    </BottomSheetModal>
  );
};
export const OrgDetails = forwardRef(_OrgDetails);
