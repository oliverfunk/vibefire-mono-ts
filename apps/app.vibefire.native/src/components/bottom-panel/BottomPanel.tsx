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

export const BottomPanel = (props: { children?: React.ReactNode }) => {
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
      overDragResistanceFactor={10}
      snapPoints={[HANDLE_HEIGHT, "90%"]}
      bottomInset={insets.bottom}
      onChange={setBottomSheetIndex}
      backgroundStyle={{
        backgroundColor: "#000000",
      }}
      handleComponent={HandleWithNavigation}
      activeOffsetX={[-10, 10]}
      activeOffsetY={[-10, 10]}
    >
      {children}
    </BottomSheet>
  );
};
