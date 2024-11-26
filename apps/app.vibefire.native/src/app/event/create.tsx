import { useLocalSearchParams } from "expo-router";

import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";
import { useFocusUserAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

import {
  CreateEventFromPreviousSheet,
  CreateEventSheet,
} from "!/features/event/create";

const Screen = () => {
  const { fromPrevious } = useLocalSearchParams<{
    fromPrevious?: string;
  }>();

  useFocusUserAuthedRedirect();
  useExpandBottomSheet();

  if (fromPrevious) {
    return <CreateEventFromPreviousSheet />;
  }

  return <CreateEventSheet />;
};
export default Screen;
