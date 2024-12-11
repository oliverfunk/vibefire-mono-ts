import { useLocalSearchParams } from "expo-router";

import { useOnFocusUserNotAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

import { EditEventWysiwygSheet } from "!/features/event/edit";

const Screen = () => {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();

  useOnFocusUserNotAuthedRedirect();

  return <EditEventWysiwygSheet eventId={eventId} />;
};
export default Screen;
