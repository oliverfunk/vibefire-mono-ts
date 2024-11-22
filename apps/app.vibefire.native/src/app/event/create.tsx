import { useLocalSearchParams } from "expo-router";

import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";
import { useUserAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

import {
  CreateEventFromPreviousSheet,
  CreateEventSheet,
} from "!/features/event/create/screens";

const Screen = () => {
  const { fromPrevious } = useLocalSearchParams<{
    fromPrevious?: string;
  }>();

  useUserAuthedRedirect();
  useExpandBottomSheet();

  if (fromPrevious) {
    return <CreateEventFromPreviousSheet />;
  }

  return <CreateEventSheet />;
};
export default Screen;
