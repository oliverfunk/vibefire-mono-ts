import { useMemo } from "react";

import { type VibefireEventT, type VibefireGroupT } from "@vibefire/models";
import { type PartialDeep } from "@vibefire/utils";

export const useSortByTime = <T extends object>(
  data: T[],
  p: {
    extract: (item: T) => Date | undefined;
    sortAsc?: boolean;
    sliceCount?: number;
  },
) => {
  const { extract, sortAsc = true, sliceCount = 0 } = p;
  return useMemo(() => {
    const sorted = [...data].sort((a, b) => {
      const aTime = extract(a);
      const bTime = extract(b);

      if (aTime && bTime) {
        if (sortAsc) {
          return aTime.getTime() - bTime.getTime();
        } else {
          return bTime.getTime() - aTime.getTime();
        }
      } else if (aTime) {
        return 1;
      } else if (bTime) {
        return -1;
      }
      return 0;
    });
    if (sliceCount > 0) {
      return sorted.slice(0, sliceCount);
    }
    return sorted;
  }, [data, extract, sliceCount, sortAsc]);
};

export const useSortedEvents = (
  events: PartialDeep<VibefireEventT>[],
  p: {
    sortAsc?: boolean;
    sliceCount?: number;
  },
) => {
  return useSortByTime(events, {
    extract: (e) =>
      e?.timeStartIsoNTZ ? new Date(e.timeStartIsoNTZ) : undefined,
    ...p,
  });
};

export const useSortedGroupsByUpdated = (
  events: VibefireGroupT[],
  p: {
    sortAsc?: boolean;
    sliceCount?: number;
  },
) => {
  return useSortByTime(events, {
    extract: (g) =>
      g?.dateUpdatedUTC ? new Date(g.dateUpdatedUTC) : undefined,
    ...p,
  });
};
