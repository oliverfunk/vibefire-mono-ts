import { useMemo } from "react";

import { type VibefireGroupT } from "@vibefire/models";

export const useSortedGroups = (groups: VibefireGroupT[], sortAsc: boolean) => {
  return useMemo(() => {
    return [...groups].sort((a, b) => {
      if (sortAsc) {
        return (
          new Date(a.dateUpdatedUTC).getTime() -
          new Date(b.dateUpdatedUTC).getTime()
        );
      } else {
        return (
          new Date(b.dateUpdatedUTC).getTime() -
          new Date(a.dateUpdatedUTC).getTime()
        );
      }
    });
  }, [groups, sortAsc]);
};
