import { useCallback, useLayoutEffect, useRef } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useNavigation } from "expo-router";
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  type BottomSheetBackdropProps,
  type BottomSheetModalProps,
} from "@gorhom/bottom-sheet";
import { useAtom } from "jotai";

import { trpc } from "!/api/trpc-client";

import { showHandleAtom } from "!/atoms";
import { navReplaceHomeWithMinimise } from "!/nav";

import { HandleWithHeader } from "./HandleWithHeader";

type BottomPanelModalPropsT = {
  modalPath: string;
  snapPoints: BottomSheetModalProps["snapPoints"];
  ts?: number;
  headerText?: string;
  handleComponent?: BottomSheetModalProps["handleComponent"];
  minimiseTwiddle?: string;
  backgroundColor?: string;
  enablePanDownToClose?: BottomSheetModalProps["enablePanDownToClose"];
  enableDismissOnClose?: BottomSheetModalProps["enableDismissOnClose"];
};

export const NewBottomPanelModal = (props: { children?: React.ReactNode }) => {
  const { children } = props;
  const modalPanelRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const utils = trpc.useUtils();

  const [showHandle] = useAtom(showHandleAtom);

  useLayoutEffect(() => {
    requestAnimationFrame(() => {
      modalPanelRef.current?.present();
    });
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === 0) {
      console.log("collapsed");
    }
  }, []);
  const renderBackdrop = useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        pressBehavior={"collapse"}
        disappearsOnIndex={0}
        appearsOnIndex={1}
      />
    ),
    [],
  );

  return (
    <GestureHandlerRootView
      style={{
        // flex: 1,
        backgroundColor: "grey",
      }}
    >
      <BottomSheetModal
        ref={modalPanelRef}
        backdropComponent={renderBackdrop}
        enableDismissOnClose={false}
        enablePanDownToClose={false}
        enableDynamicSizing={false}
        snapPoints={[60, "80%"]}
        bottomInset={insets.bottom}
        onChange={handleSheetChanges}
        backgroundStyle={{
          backgroundColor: "rgba(0,255,255,1)",
        }}
        handleComponent={showHandle ? undefined : null}
        onDismiss={() => {
          modalPanelRef.current?.present();
        }}
      >
        {children}
      </BottomSheetModal>
    </GestureHandlerRootView>
  );
};

export const BottomPanelModal = (
  props: BottomPanelModalPropsT & { children?: React.ReactNode },
) => {
  const {
    modalPath,
    snapPoints,
    ts,
    headerText,
    handleComponent,
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
    <View className="left-[50%]">
      <BottomSheetModal
        ref={modalPanelRef}
        // style={{
        //   maxWidth: 800,
        // }}
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
          const navState = navigation.getState();
          const routes = navState.routes;
          const isTopRoute = routes.at(-1)?.name === modalPath;
          if (isTopRoute) {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navReplaceHomeWithMinimise();
            }
          }
          await utils.invalidate();
        }}
      >
        {children}
      </BottomSheetModal>
    </View>
  );
};
