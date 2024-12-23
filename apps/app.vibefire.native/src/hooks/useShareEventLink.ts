import { useCallback } from "react";
import { Share } from "react-native";

import { vibefireEventShareURL } from "@vibefire/utils";

export const useShareEventLink = (
  eventId: string,
  memberShareCode?: string,
) => {
  return useCallback(async () => {
    try {
      await Share.share({
        message: `Vibefire | Checkout out this event!\n${vibefireEventShareURL(
          eventId,
          memberShareCode,
        )}`,
      });
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [eventId, memberShareCode]);
};
