import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { BottomPanelModal } from "!/components/bottom-panel/BottomPanelModal";
import { EditEventWysiwyg } from "!/features/edit-event";
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
      modalPath="event/[linkId]/edit"
      ts={ts}
      headerText={"Edit Event"}
      enablePanDownToClose={Platform.OS === "android" ? false : true}
      snapPoints={["80%"]}
      backgroundColor="black"
    >
      <EditEventWysiwyg eventLinkId={linkId} />
    </BottomPanelModal>
  );
};
export default Screen;
