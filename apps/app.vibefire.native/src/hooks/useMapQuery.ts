import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";

import { type TModelVibefireEvent } from "@vibefire/models";
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
  return mapQuery;
};

export const useMapDisplayableEvents = () => {
  const geoPeriodQuery = useGeoPeriodQuery();

  const setMapDisplayEventsInfo = useSetAtom(mapDisplayableEventsInfoAtom);
  const [mapDisplayableEvents, setMapDisplayableEvents] = useAtom(
    mapDisplayableEventsAtom,
  );
  useEffect(() => {
    if (geoPeriodQuery.isLoading) {
      setMapDisplayEventsInfo((v) => ({
        numberOfEvents: v.numberOfEvents,
        queryStatus: "loading",
      }));
      return;
    }
    if (geoPeriodQuery.isError) {
      setMapDisplayEventsInfo((v) => ({
        numberOfEvents: v.numberOfEvents,
        queryStatus: "done",
      }));
      return;
    }
    if (geoPeriodQuery.isSuccess) {
      const d = geoPeriodQuery.data;
      if (d.ok) {
        setMapDisplayableEvents(d.value);
        setMapDisplayEventsInfo({
          numberOfEvents: d.value.length,
          queryStatus: "done",
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [geoPeriodQuery.status]);

  return mapDisplayableEvents;
};
