import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useTsQueryParam } from "!/hooks/useTs";

import { EditEventWysiwyg } from "!/features/event-edit";
import { BottomPanelModal } from "!/components/bottom-panel/BottomPanelModal";

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
