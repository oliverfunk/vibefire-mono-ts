import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useTsQueryParam } from "!/hooks/useTs";

import { BottomPanelModal } from "!/c/bottom-panel/BottomPanelModal";
import { ManageEvent } from "!/c/bottom-panel/manage-event/ManageEvent";

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
