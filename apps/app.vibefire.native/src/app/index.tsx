import { useLocalSearchParams } from "expo-router";

import {
  BottomPanelHandle,
  SEARCH_HANDLE_HEIGHT,
} from "~/components/bottom-panel/BottomPanelHandle";
import { BottomPanelModal } from "~/components/bottom-panel/BottomPanelModal";
import { EventsListAndProfile } from "~/components/bottom-panel/EventsListAndProfile";
import { useNotificationObserver } from "~/hooks/useNotificationObserver";
import { useTsQueryParam } from "~/hooks/useTs";

const Screen = () => {
  const { profileSelected, minimise } = useLocalSearchParams<{
    profileSelected?: string;
    minimise?: string;
  }>();

  const ts = useTsQueryParam();

  // this isn't the best place for this
  // should use a nested group and put it in the layout there
  // but is okay for now as the index route should also be
  // loaded on app start
  useNotificationObserver();

  console.log("profileSelected", JSON.stringify(profileSelected, null, 2));

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
