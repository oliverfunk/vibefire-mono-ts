import { useLocalSearchParams } from "expo-router";

import { BottomPanelModal } from "!/components/bottom-panel/BottomPanelModal";
import { EventDetails } from "!/components/bottom-panel/EventDetails";
import { useTsQueryParam } from "!/hooks/useTs";

const Screen = () => {
  const { linkId, preview } = useLocalSearchParams<{
    linkId: string;
    preview: string;
  }>();

  const ts = useTsQueryParam();

  if (!linkId) {
    return null;
  }

  return (
    <BottomPanelModal
      modalPath="event/[linkId]/index"
      ts={ts}
      snapPoints={["80%"]}
      backgroundColor="black"
      handleComponent={null}
    >
      <EventDetails linkId={linkId} preview={!!preview} />
    </BottomPanelModal>
  );
};
export default Screen;
