import { useLocalSearchParams } from "expo-router";

import { EditEventWysiwygSheet } from "!/features/event/edit";

const Screen = () => {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();

  if (!eventId) {
    return null;
  }

  return <EditEventWysiwygSheet eventId={eventId} />;
};
export default Screen;
