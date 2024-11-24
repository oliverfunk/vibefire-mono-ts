import { useLocalSearchParams } from "expo-router";

import {
  ViewEventPreviewSheet,
  ViewEventPublishedSheet,
  ViewEventViaLinkSheet,
} from "!/features/event/view";

const Screen = () => {
  const { eventId, preview, link } = useLocalSearchParams<{
    eventId: string;
    preview?: string;
    link?: string;
  }>();

  if (!eventId) {
    return null;
  }

  if (link === "true") {
    return <ViewEventViaLinkSheet eventId={eventId} />;
  }
  if (preview === "true") {
    return <ViewEventPreviewSheet eventId={eventId} />;
  }
  return <ViewEventPublishedSheet eventId={eventId} />;
};
export default Screen;
