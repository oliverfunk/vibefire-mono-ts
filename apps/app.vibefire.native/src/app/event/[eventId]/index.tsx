import { useLocalSearchParams } from "expo-router";

import { useTsQueryParam } from "!/hooks/useTs";

import { BottomPanelModal } from "!/c/bottom-panel/BottomPanelModal";
import { EventDetails } from "!/c/bottom-panel/EventDetails";

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
