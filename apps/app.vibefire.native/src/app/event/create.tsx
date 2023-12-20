import { Platform } from "react-native";
import { useLocalSearchParams } from "expo-router";

import { BottomPanelModal } from "~/components/bottom-panel/BottomPanelModal";
import { CreateEvent } from "~/components/bottom-panel/create-event/CreateEvent";
import { useTsQueryParam } from "~/hooks/useTs";

const Screen = () => {
  const { fromPrevious } = useLocalSearchParams<{
    fromPrevious?: string;
  }>();

  const ts = useTsQueryParam();

  console.log("CREATE");

  return (
    <BottomPanelModal
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
