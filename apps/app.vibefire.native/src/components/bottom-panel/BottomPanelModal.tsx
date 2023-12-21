import { useLayoutEffect, useRef } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import {
  BottomSheetModal,
  type BottomSheetModalProps,
} from "@gorhom/bottom-sheet";

import { trpc } from "~/apis/trpc-client";
import { navHomeWithMinimise } from "~/nav";
import { HandleWithHeader } from "./HandleWithHeader";

type BottomPanelModalPropsT = {
  snapPoints: BottomSheetModalProps["snapPoints"];
  ts: number;
  headerText?: string;
  handleComponent?: BottomSheetModalProps["handleComponent"];
  handleHeight?: BottomSheetModalProps["handleHeight"];
  minimiseTwiddle?: string;
  backgroundColor?: string;
  enablePanDownToClose?: BottomSheetModalProps["enablePanDownToClose"];
  enableDismissOnClose?: BottomSheetModalProps["enableDismissOnClose"];
};

export const BottomPanelModal = (
  props: BottomPanelModalPropsT & { children?: React.ReactNode },
) => {
  const {
    snapPoints,
    ts,
    headerText,
    handleComponent,
    handleHeight,
    minimiseTwiddle,
    backgroundColor,
    enablePanDownToClose,
    enableDismissOnClose,
    children,
  } = props;

  const modalPanelRef = useRef<BottomSheetModal>(null);

  const navigation = useNavigation();

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
      enableDismissOnClose={enableDismissOnClose}
      enablePanDownToClose={enablePanDownToClose}
      stackBehavior="push"
      backgroundStyle={{
        backgroundColor: backgroundColor ?? "rgba(255,255,255,1)",
      }}
      bottomInset={insets.bottom}
      index={0}
      snapPoints={snapPoints}
      onDismiss={async () => {
        if (!navigation.canGoBack()) {
          navHomeWithMinimise();
        }

        await utils.invalidate();
      }}
    >
      {children}
    </BottomSheetModal>
  );
};
