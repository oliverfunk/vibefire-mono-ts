import { useLocalSearchParams } from "expo-router";

import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";
import { useOnFocusUserNotAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

import {
  CreateEventFromPreviousSheet,
  CreateEventSheet,
} from "!/features/event/create";

const Screen = () => {
  const { fromPrevious } = useLocalSearchParams<{
    fromPrevious?: string;
  }>();

  useOnFocusUserNotAuthedRedirect();
  useExpandBottomSheet();

  if (fromPrevious) {
    return <CreateEventFromPreviousSheet />;
  }

  return <CreateEventSheet />;
};
export default Screen;
