import { useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
} from "@gorhom/bottom-sheet";
import { useSetAtom } from "jotai";

import { bottomSheetIndex } from "!/atoms";

import { HANDLE_HEIGHT, HandleWithNavigation } from "./HandleWithNavigation";

const BottomPanelBackdrop = (props: BottomSheetBackdropProps) => (
  <BottomSheetBackdrop
    {...props}
    pressBehavior={"collapse"}
    disappearsOnIndex={0}
    appearsOnIndex={1}
  />
);

export const BottomPanelPersistentModal = (props: {
  children?: React.ReactNode;
}) => {
  const { children } = props;

  const modalPanelRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();

  const setBottomSheetIndex = useSetAtom(bottomSheetIndex);

  return (
    <BottomSheet
      ref={modalPanelRef}
      backdropComponent={BottomPanelBackdrop}
      enablePanDownToClose={false}
      enableDynamicSizing={false}
      snapPoints={[HANDLE_HEIGHT, "80%"]}
      bottomInset={insets.bottom}
      onChange={setBottomSheetIndex}
      backgroundStyle={{
        backgroundColor: "#171717",
      }}
      handleComponent={HandleWithNavigation}
    >
      {children}
    </BottomSheet>
  );
};
