import { useLocalSearchParams } from "expo-router";
import { useBottomSheet } from "@gorhom/bottom-sheet";

import {
  BottomPanelHandle,
  SEARCH_HANDLE_HEIGHT,
} from "~/components/bottom-panel/BottomPanelHandle";
import { BottomPanelModal } from "~/components/bottom-panel/BottomPanelModal";
import { EventsListAndProfile } from "~/components/bottom-panel/EventsListAndProfile";
import { useTsQueryParam } from "~/hooks/useTs";

const Screen = () => {
  const { profileSelected, minimise } = useLocalSearchParams<{
    profileSelected?: string;
    minimise?: string;
  }>();

  const ts = useTsQueryParam();

  return (
    <BottomPanelModal
      ts={ts}
      handleHeight={SEARCH_HANDLE_HEIGHT}
      handleComponent={BottomPanelHandle}
      backgroundColor="rgba(255,255,255,0.9)"
      snapPoints={[SEARCH_HANDLE_HEIGHT, "80%"]}
      minimiseTwiddle={minimise}
    >
      <EventsListAndProfile profileSelected={!!profileSelected} />
    </BottomPanelModal>
  );
};
export default Screen;
