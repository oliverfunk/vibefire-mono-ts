import { useLocalSearchParams } from "expo-router";

import { EditEventWysiwyg } from "!/features/event/edit";

const Screen = () => {
  const { eventId } = useLocalSearchParams<{
    eventId: string;
  }>();

  if (!eventId) {
    return null;
  }

  return <EditEventWysiwyg eventId={eventId} />;
};
export default Screen;
