import { useEffect, useLayoutEffect } from "react";
import { Button, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useAtom, useSetAtom } from "jotai";

import { useNotificationsResponder } from "!/hooks/useNotificationsResponder";
import { useTsQueryParam } from "!/hooks/useTs";

import { EventsQueryListSheet } from "!/features/events-list";
import { UserProfileSheet } from "!/features/user-profile";
import { bottomSheetIndex } from "!/atoms";
import {
  BottomPanelHandle,
  SEARCH_HANDLE_HEIGHT,
} from "!/c/bottom-panel/BottomPanelHandle";
import { BottomPanelModal } from "!/c/bottom-panel/BottomPanelModal";

const Screen = () => {
  // this isn't the best place for this
  // should use a nested group and put it in the layout there
  // but is okay for now as the index route should also be
  // loaded on app start
  // you need a route to have loaded before this can be called
  useNotificationsResponder();

  // const impersonating = true;

  // const { signIn } = useSignIn();
  // if (impersonating) {
  //   signIn
  //     ?.create({
  //       strategy: "ticket",
  //       ticket:
  //         "",
  //     })
  //     .then((p) => {
  //       console.log("signed in", JSON.stringify(p, null, 2));
  //     })
  //     .catch((err) => {
  //       console.error("sign in error", JSON.stringify(err, null, 2));
  //     });
  // }

  return (
    <View>
      <Button
        onPress={() => router.navigate("/profile")}
        title="Show Profile"
      />
      <EventsQueryListSheet />
    </View>
  );
  // <BottomPanelModal
  //   modalPath="index"
  //   ts={ts}
  //   handleComponent={BottomPanelHandle}
  //   backgroundColor="rgba(255,255,255,0.9)"
  //   snapPoints={[SEARCH_HANDLE_HEIGHT, "80%"]}
  //   minimiseTwiddle={minimise}
  //   enableDismissOnClose={false}
  //   enablePanDownToClose={false}
  // >
  //   {profileSelected ? UserProfile : }
  // </BottomPanelModal>
};
export default Screen;
