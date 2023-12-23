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
  //         "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJlaXMiOjM2MDAwLCJleHAiOjE3MDMzNzc4MTgsImlpZCI6Imluc18yVDlVeWlobjBaMzQyYm5RcTB3MGFSR29zY04iLCJzaWQiOiJhY3RfMlp3bjRjNFNuTjRISGVUYjhFSzdwZTI5aW9mIiwic3QiOiJhY3Rvcl90b2tlbiJ9.Stx85kdKkTBiP4DPcpw5a0AQPcl4Q7OXx0wQ39pBpvQfQ6uhfO1izocscYPWw5fQh_SCL3q0IN8h1JR-n--DEmyK5gdcZ2LqZrSswgmXzmUls4BJZP0HguQ5EYTXbxO1C5LzlNRrNlODxfcZf1XzsNzBeimUjaLtDjMvV3qMrsvpDbtewhXiXwRgUpf-MHXHUbK17sjdMn8TjJsO7VSQ4mDqNXjd878h-PlGuS3UYaqv3wEq-8DHOOKfqJu09pVWfEq-SbPbCMyEcYrda3vA3ub03HPXsqdk3Yhyv9lCCf60GmHKD4WpvHg0setNGw4ciKx-rIssfeGlZdoDnNQWUw",
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
