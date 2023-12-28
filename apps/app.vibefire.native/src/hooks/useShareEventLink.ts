import { useCallback } from "react";
import { Share } from "react-native";

import { type VibefireEventT } from "@vibefire/models";
import { vibefireEventShareURL } from "@vibefire/utils";

export const useShareEventLink = (event: VibefireEventT) => {
  return useCallback(async () => {
    try {
      await Share.share({
        message: `Vibefire | Checkout out this event!\n${vibefireEventShareURL(
          event.linkId,
        )}`,
      });
    } catch (error: unknown) {
      console.warn(JSON.stringify(error, null, 2));
    }
  }, [event]);
};
