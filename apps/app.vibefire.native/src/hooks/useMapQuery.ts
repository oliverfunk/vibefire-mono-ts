import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";

import {
  mapQueryInfo,
  mapQueryPositionAtom,
  mapQueryTimePeriodAtom,
} from "@vibefire/shared-state";

import { trpc } from "~/apis/trpc-client";

export const useMapQuery = () => {
  const mapPos = useAtomValue(mapQueryPositionAtom);
  const tp = useAtomValue(mapQueryTimePeriodAtom);
  const [mqi, setMqi] = useAtom(mapQueryInfo);
  const mapQuery = trpc.events.mapQueryPublicEvents.useQuery(
    mapPos === null
      ? {
          timePeriod: "",
          northEast: {
            lat: 0,
            lng: 0,
          },
          southWest: {
            lat: 0,
            lng: 0,
          },
          zoomLevel: 0,
        }
      : {
          timePeriod: tp,
          northEast: mapPos.northEast,
          southWest: mapPos.southWest,
          zoomLevel: mapPos.zoomLevel,
        },
    { enabled: mapPos !== null },
  );
  useEffect(() => {
    switch (mapQuery.status) {
      case "loading":
        setMqi({
          numberOfEvents: mqi.numberOfEvents,
          queryStatus: "loading",
        });
        break;
      case "error":
        setMqi({
          numberOfEvents: mqi.numberOfEvents,
          queryStatus: "done",
        });
        break;
      case "success":
        const a = mapQuery.data;

        setMqi({
          numberOfEvents: mapQuery.data.length,
          queryStatus: "done",
        });
        break;
    }
  }, [mapQuery.status]);
  return mapQuery;
};
