import { useLocalSearchParams } from "expo-router";

import { useTsQueryParam } from "!/hooks/useTs";

import { GroupSheet } from "!/features/group-view";
import { BottomPanelModal } from "!/c/bottom-panel/BottomPanelModal";

const Screen = () => {
  const { linkId } = useLocalSearchParams<{
    linkId: string;
  }>();

  const ts = useTsQueryParam();

  if (!linkId) {
    return null;
  }

  return (
    <BottomPanelModal
      modalPath="group/[linkId]/index"
      ts={ts}
      snapPoints={["80%"]}
      backgroundColor="black"
      handleComponent={null}
    >
      <GroupSheet groupLinkID={linkId} />
    </BottomPanelModal>
  );
};
export default Screen;
