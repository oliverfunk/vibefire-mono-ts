import { useLocalSearchParams } from "expo-router";

import { useOnFocusUserNotAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

import { EditEventWysiwygSheet } from "!/features/event/edit";

const Screen = () => {
  const { eventId, create } = useLocalSearchParams<{
    eventId: string;
    create?: string;
  }>();

  useOnFocusUserNotAuthedRedirect();

  return <EditEventWysiwygSheet eventId={eventId} create={create === "true"} />;
};
export default Screen;
