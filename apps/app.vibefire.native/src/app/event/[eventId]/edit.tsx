import { useLocalSearchParams } from "expo-router";

import { useOnFocusUserNotAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

import { EditEventSheet } from "!/features/event/edit";

const Screen = () => {
  const { eventId, create, selectLocation } = useLocalSearchParams<{
    eventId: string;
    create?: string;
    selectLocation?: string;
  }>();

  useOnFocusUserNotAuthedRedirect();

  return (
    <EditEventSheet
      eventId={eventId}
      isCreateNew={create === "true"}
      isSelectingLocation={selectLocation === "true"}
    />
  );
};
export default Screen;
