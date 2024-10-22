import { useMemo } from "react";

import {
  type TModelVibefireEvent,
  type TModelVibefireGroup,
} from "@vibefire/models";
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
  events: PartialDeep<TModelVibefireEvent>[],
  p: {
    sortAsc?: boolean;
    sliceCount?: number;
  },
) => {
  return useSortByTime(events, {
    extract: (e) => (e.times?.tsStart ? new Date(e.times?.tsStart) : undefined),
    ...p,
  });
};

export const useSortedGroupsByUpdated = (
  events: TModelVibefireGroup[],
  p: {
    sortAsc?: boolean;
    sliceCount?: number;
  },
) => {
  return useSortByTime(events, {
    extract: (g) => undefined,
    ...p,
  });
};
