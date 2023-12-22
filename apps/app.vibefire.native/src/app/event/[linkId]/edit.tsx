import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { BottomPanelModal } from "~/components/bottom-panel/BottomPanelModal";
import { EditEventDetails } from "~/components/bottom-panel/edit-event-details/EditEventDetails";
import { useTsQueryParam } from "~/hooks/useTs";

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
    >
      <EditEventDetails linkId={linkId} section={section} />
    </BottomPanelModal>
  );
};
export default Screen;
