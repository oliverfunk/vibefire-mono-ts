import { Platform } from "react-native";

import { useTsQueryParam } from "!/hooks/useTs";

import { BottomPanelModal } from "!/c/bottom-panel/BottomPanelModal";
import { EventsByOrganiser } from "!/c/bottom-panel/EventsByOrganiser";

const Screen = () => {
  const ts = useTsQueryParam();

  return (
    <BottomPanelModal
      modalPath="events-by-organiser"
      ts={ts}
      headerText={"Your Events"}
      enablePanDownToClose={Platform.OS === "android" ? false : true}
      snapPoints={["80%"]}
    >
      <EventsByOrganiser />
    </BottomPanelModal>
  );
};
export default Screen;
