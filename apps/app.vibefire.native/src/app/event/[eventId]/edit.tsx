import { useLocalSearchParams } from "expo-router";

import { useFocusUserAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

import { EditEventWysiwygSheet } from "!/features/event/edit";

const Screen = () => {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();

  useFocusUserAuthedRedirect();

  return <EditEventWysiwygSheet eventId={eventId} />;
};
export default Screen;
