import { Platform } from "react-native";

import { BottomPanelModal } from "~/components/bottom-panel/BottomPanelModal";
import { EventsByOrganiser } from "~/components/bottom-panel/EventsByOrganiser";
import { useTsQueryParam } from "~/hooks/useTs";

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
