import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { useTsQueryParam } from "!/hooks/useTs";

import { CreateEvent } from "!/features/event/create";
import { BottomPanelModal } from "!/c/bottom-panel/BottomPanelModal";

const Screen = () => {
  const { fromPrevious } = useLocalSearchParams<{
    fromPrevious?: string;
  }>();

  const ts = useTsQueryParam();

  return (
    <BottomPanelModal
      modalPath="event/create"
      headerText={"Create Event"}
      enablePanDownToClose={Platform.OS === "android" ? false : true}
      snapPoints={["80%"]}
      ts={ts}
    >
      <CreateEvent fromPrevious={!!fromPrevious} />
    </BottomPanelModal>
  );
};
export default Screen;
