import { useLocalSearchParams } from "expo-router";

import { BottomPanelModal } from "~/components/bottom-panel/BottomPanelModal";
import { EventDetails } from "~/components/bottom-panel/EventDetails";
import { useTsQueryParam } from "~/hooks/useTs";

const Screen = () => {
  const { linkId, isPreview } = useLocalSearchParams<{
    linkId: string;
    isPreview: string;
  }>();

  const ts = useTsQueryParam();

  if (!linkId) {
    return null;
  }

  return (
    <BottomPanelModal
      ts={ts}
      snapPoints={["80%"]}
      backgroundColor="black"
      handleComponent={null}
    >
      <EventDetails linkId={linkId} isPreview={!!isPreview} />
    </BottomPanelModal>
  );
};
export default Screen;
