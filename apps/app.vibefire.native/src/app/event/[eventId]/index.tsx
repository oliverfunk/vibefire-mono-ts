import { Redirect, useLocalSearchParams } from "expo-router";
import { useAtom } from "jotai";

import {
  ViewEventPreviewSheet,
  ViewEventPublishedSheet,
  ViewEventViaLinkSheet,
} from "!/features/event/view";
import { userAtom } from "!/atoms";

const Screen = () => {
  const { eventId, preview, link } = useLocalSearchParams<{
    eventId: string;
    preview?: string;
    link?: string;
  }>();

  const [user] = useAtom(userAtom);

  if (link === "true") {
    return <ViewEventViaLinkSheet eventId={eventId} />;
  }
  if (preview === "true") {
    if (user.state !== "authenticated") {
      return <Redirect href="/profile" />;
    }
    return <ViewEventPreviewSheet eventId={eventId} />;
  }
  return <ViewEventPublishedSheet eventId={eventId} />;
};
export default Screen;
