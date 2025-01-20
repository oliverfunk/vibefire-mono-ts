import { useEffect } from "react";
import { type UseTRPCQueryResult } from "@trpc/react-query/dist/shared";
import { useAtom, useSetAtom } from "jotai";

import { type MapPositionInfoT } from "@vibefire/models";
import {
  mapDisplayableEventsAtom,
  mapDisplayableEventsInfoAtom,
  mapPositionInfoAtom,
  selectedDateDTAtom,
} from "@vibefire/shared-state";
import { toDateStr } from "@vibefire/utils";

import { trpc } from "!/api/trpc-client";

const useGeoPeriodQuery = () => {
  const [mapPos] = useAtom(mapPositionInfoAtom);
  const [selectedDateDT] = useAtom(selectedDateDTAtom);
  const mapQuery = trpc.events.queryGeoPeriods.useQuery(
    mapPos === null
      ? {
          fromDate: toDateStr(selectedDateDT),
          northEast: {
            lat: 0,
            lng: 0,
          },
          southWest: {
            lat: 0,
            lng: 0,
          },
        }
      : {
          fromDate: toDateStr(selectedDateDT),
          northEast: mapPos.northEast,
          southWest: mapPos.southWest,
        },
    { enabled: mapPos !== null },
  );
  return { mapQuery, mapPos };
};

export const useMapDisplayableEvents = () => {
  const { mapQuery, mapPos } = useGeoPeriodQuery();

  const setMapDisplayEventsInfo = useSetAtom(mapDisplayableEventsInfoAtom);
  const [mapDisplayableEvents, setMapDisplayableEvents] = useAtom(
    mapDisplayableEventsAtom,
  );
  useEffect(() => {
    if (mapQuery.isLoading) {
      setMapDisplayEventsInfo((v) => ({
        numberOfEvents: v.numberOfEvents,
        queryStatus: "loading",
      }));
      return;
    }
    if (mapQuery.isError) {
      setMapDisplayEventsInfo((v) => ({
        numberOfEvents: v.numberOfEvents,
        queryStatus: "done",
      }));
      return;
    }
    if (mapQuery.isSuccess) {
      const d = mapQuery.data;
      if (d.ok && mapPos) {
        const visible = d.value.filter((e) => {
          const expansionFactor = 1.1;
          return (
            e.location.position.lat >= mapPos.southWest.lat &&
            e.location.position.lat <= mapPos.northEast.lat &&
            e.location.position.lng <= mapPos.northEast.lng &&
            e.location.position.lng >= mapPos.southWest.lng
          );
        });
        setMapDisplayableEvents(visible);
        setMapDisplayEventsInfo({
          numberOfEvents: visible.length,
          queryStatus: "done",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mapQuery.status]);

  return mapDisplayableEvents;
};
