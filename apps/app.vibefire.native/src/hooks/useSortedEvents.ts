import { useMemo } from "react";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

export const useSortedEvents = (
  events: PartialDeep<VibefireEventT>[],
  sortAsc: boolean,
) => {
  return useMemo(() => {
    return [...events].sort((a, b) => {
      if (a.timeStartIsoNTZ && b.timeStartIsoNTZ) {
        if (sortAsc) {
          return (
            new Date(a.timeStartIsoNTZ).getTime() -
            new Date(b.timeStartIsoNTZ).getTime()
          );
        } else {
          return (
            new Date(b.timeStartIsoNTZ).getTime() -
            new Date(a.timeStartIsoNTZ).getTime()
          );
        }
      } else if (a.timeStartIsoNTZ) {
        return 1;
      } else if (b.timeStartIsoNTZ) {
        return -1;
      }
      return 0;
    });
  }, [events, sortAsc]);
};
