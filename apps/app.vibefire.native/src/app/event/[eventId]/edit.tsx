import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { EditEventWysiwyg } from "!/features/event-edit";
import { BottomPanelModal } from "!/c/bottom-panel/BottomPanelModal";

const Screen = () => {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();

  if (!eventId) {
    return null;
  }

  return (
    <BottomPanelModal
      modalPath="event/[linkId]/edit"
      headerText={"Edit Event"}
      enablePanDownToClose={Platform.OS === "android" ? false : true}
      snapPoints={["80%"]}
      backgroundColor="black"
    >
      <EditEventWysiwyg eventId={eventId} />
    </BottomPanelModal>
  );
};
export default Screen;
