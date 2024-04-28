import { useMemo } from "react";
import { type PartialDeep } from "type-fest";

import { type VibefireEventT } from "@vibefire/models";

export const useSortedEvents = (
  events: PartialDeep<VibefireEventT>[],
  sortAsc: boolean,
  sliceCount = 0,
) => {
  return useMemo(() => {
    const sorted = [...events].sort((a, b) => {
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
    if (sliceCount > 0) {
      return sorted.slice(0, sliceCount);
    }
    return sorted;
  }, [events, sliceCount, sortAsc]);
};
