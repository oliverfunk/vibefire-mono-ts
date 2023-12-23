import { useLocalSearchParams } from "expo-router";
import { useSignIn } from "@clerk/clerk-expo";

import {
  BottomPanelHandle,
  SEARCH_HANDLE_HEIGHT,
} from "~/components/bottom-panel/BottomPanelHandle";
import { BottomPanelModal } from "~/components/bottom-panel/BottomPanelModal";
import { EventsListAndProfile } from "~/components/bottom-panel/EventsListAndProfile";
import { useTsQueryParam } from "~/hooks/useTs";

const Screen = () => {
  const { profileSelected, minimise } = useLocalSearchParams<{
    profileSelected?: string;
    minimise?: string;
  }>();

  const ts = useTsQueryParam();

  // const impersonating = true;

  // const { signIn } = useSignIn();
  // if (impersonating) {
  //   signIn
  //     ?.create({
  //       strategy: "ticket",
  //       ticket:
  //         "***REMOVED***",
  //     })
  //     .then((p) => {
  //       console.log("signed in", JSON.stringify(p, null, 2));
  //     })
  //     .catch((err) => {
  //       console.error("sign in error", JSON.stringify(err, null, 2));
  //     });
  // }

  return (
    <BottomPanelModal
      modalPath="index"
      ts={ts}
      handleHeight={SEARCH_HANDLE_HEIGHT}
      handleComponent={BottomPanelHandle}
      backgroundColor="rgba(255,255,255,0.9)"
      snapPoints={[SEARCH_HANDLE_HEIGHT, "80%"]}
      minimiseTwiddle={minimise}
      enableDismissOnClose={false}
      enablePanDownToClose={false}
    >
      <EventsListAndProfile profileSelected={!!profileSelected} />
    </BottomPanelModal>
  );
};
export default Screen;
