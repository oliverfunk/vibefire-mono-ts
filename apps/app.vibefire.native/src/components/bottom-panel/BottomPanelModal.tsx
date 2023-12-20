import { useLayoutEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BottomSheetModal, type BottomSheetProps } from "@gorhom/bottom-sheet";

import { trpc } from "~/apis/trpc-client";
import { HandleWithHeader } from "./HandleWithHeader";

type BottomPanelModalPropsT = {
  snapPoints: BottomSheetProps["snapPoints"];
  ts: number;
  headerText?: string;
  handleComponent?: BottomSheetProps["handleComponent"];
  handleHeight?: BottomSheetProps["handleHeight"];
  minimiseTwiddle?: string;
  backgroundColor?: string;
  enablePanDownToClose?: boolean;
};

export const BottomPanelModal = (
  props: BottomPanelModalPropsT & { children?: React.ReactNode },
) => {
  const {
    snapPoints,
    headerText,
    handleComponent,
    handleHeight,
    minimiseTwiddle,
    backgroundColor,
    enablePanDownToClose,
    ts,
    children,
  } = props;

  const modalPanelRef = useRef<BottomSheetModal>(null);

  const insets = useSafeAreaInsets();
  const utils = trpc.useUtils();

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      modalPanelRef.current?.present();
    });
  }, [ts]);

  useLayoutEffect(() => {
    if (!minimiseTwiddle) {
      return;
    }
    requestAnimationFrame(() => {
      modalPanelRef.current?.collapse();
    });
  }, [minimiseTwiddle]);

  return (
    <BottomSheetModal
      ref={modalPanelRef}
      handleHeight={handleHeight}
      handleComponent={
        handleComponent === null
          ? null
          : handleComponent
            ? handleComponent
            : headerText
              ? (p) => HandleWithHeader({ header: headerText, ...p })
              : undefined
      }
      enablePanDownToClose={enablePanDownToClose ?? true}
      stackBehavior="push"
      backgroundStyle={{
        backgroundColor: backgroundColor ?? "rgba(255,255,255,1)",
      }}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={snapPoints}
      onDismiss={async () => {
        await utils.invalidate();
      }}
    >
      {children}
    </BottomSheetModal>
  );
};
