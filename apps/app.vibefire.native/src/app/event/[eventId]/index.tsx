import { Redirect, useLocalSearchParams } from "expo-router";
import { useAtom } from "jotai";

import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";

import {
  ViewEventPreviewSheet,
  ViewEventPublishedSheet,
} from "!/features/event/view";
import { userAtom } from "!/atoms";

const Screen = () => {
  const { eventId, preview, shareCode } = useLocalSearchParams<{
    eventId: string;
    preview?: string;
    shareCode?: string;
  }>();

  const [user] = useAtom(userAtom);

  useExpandBottomSheet(500);

  if (preview === "true") {
    if (user.state !== "authenticated") {
      return <Redirect href="/profile" />;
    }
    return <ViewEventPreviewSheet eventId={eventId} />;
  }
  return <ViewEventPublishedSheet eventId={eventId} shareCode={shareCode} />;
};
export default Screen;
