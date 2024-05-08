import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { BottomPanelModal } from "!/components/bottom-panel/BottomPanelModal";
import { ManageEvent } from "!/components/bottom-panel/manage-event/ManageEvent";
import { useTsQueryParam } from "!/hooks/useTs";

const Screen = () => {
  const { linkId, section } = useLocalSearchParams<{
    linkId: string;
    section: string;
  }>();

  const ts = useTsQueryParam();

  if (!linkId) {
    return null;
  }

  return (
    <BottomPanelModal
      modalPath="event/[linkId]/manage"
      ts={ts}
      headerText={"Manage Event"}
      enablePanDownToClose={Platform.OS === "android" ? false : true}
      snapPoints={["80%"]}
    >
      <ManageEvent linkId={linkId} section={section} />
    </BottomPanelModal>
  );
};
export default Screen;
