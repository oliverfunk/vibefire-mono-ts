import { useEffect, useState } from "react";
import { useAtom, useSetAtom } from "jotai";

import { type VibefireEventT } from "@vibefire/models";
import {
  displayEventsInfoAtom,
  mapPositionDateEventsQueryResultAtom as mapPositionDateEventsAtom,
  mapPositionInfoAtom,
  selectedDateDTAtom,
  todayDTAtom,
  upcomingEventsQueryResultAtom,
} from "@vibefire/shared-state";
import { toDateStr } from "@vibefire/utils";

import { trpc } from "!/api/trpc-client";

const useUpcomingEventsQuery = () => {
  const [todayDT] = useAtom(todayDTAtom);
  const [selectedDateDT] = useAtom(selectedDateDTAtom);
  const upcomingEvents = trpc.events.starredOwnedEvents.useQuery({
    onDateIsoNTZ: selectedDateDT.toISO()!,
    isUpcoming: selectedDateDT.hasSame(todayDT, "day"),
  });
  return upcomingEvents;
};

const useMapPositionDateEventsQuery = () => {
  const [mapPos] = useAtom(mapPositionInfoAtom);
  const [selectedDateDT] = useAtom(selectedDateDTAtom);
  const mapQuery = trpc.events.mapPositionDatePublicEvents.useQuery(
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
          timePeriod: toDateStr(selectedDateDT),
          northEast: mapPos.northEast,
          southWest: mapPos.southWest,
          zoomLevel: mapPos.zoomLevel,
        },
    { enabled: mapPos !== null },
  );
  return mapQuery;
};

export const useDisplayEvents = () => {
  const upcomingEventsQuery = useUpcomingEventsQuery();
  const mapPositionDateEventsQuery = useMapPositionDateEventsQuery();

  const setUpcomingEvents = useSetAtom(upcomingEventsQueryResultAtom);
  const setMapPositionDateEvents = useSetAtom(mapPositionDateEventsAtom);

  const setMapDisplayEventsInfo = useSetAtom(displayEventsInfoAtom);

  const [mapDisplayEvents, setMapDisplayEvents] = useState<VibefireEventT[]>(
    [],
  );

  useEffect(() => {
    const areLoading =
      mapPositionDateEventsQuery.isLoading || upcomingEventsQuery.isLoading;
    const areError =
      mapPositionDateEventsQuery.isError || upcomingEventsQuery.isError;
    const bothSuccess =
      mapPositionDateEventsQuery.isSuccess && upcomingEventsQuery.isSuccess;

    if (areLoading) {
      setMapDisplayEventsInfo((v) => ({
        numberOfEvents: v.numberOfEvents,
        queryStatus: "loading",
      }));
      return;
    }
    if (areError) {
      setMapDisplayEventsInfo((v) => ({
        numberOfEvents: v.numberOfEvents,
        queryStatus: "done",
      }));
      return;
    }
    if (bothSuccess) {
      const upcomingEvents = upcomingEventsQuery.data;
      const mapPositionDateEvents = mapPositionDateEventsQuery.data.filter(
        (v) => upcomingEvents.findIndex((t) => t.id === v.id) === -1,
      );

      setUpcomingEvents(upcomingEvents);
      setMapPositionDateEvents(mapPositionDateEvents);

      const displayEvents = [...upcomingEvents, ...mapPositionDateEvents];

      setMapDisplayEvents(displayEvents);
      setMapDisplayEventsInfo({
        numberOfEvents: displayEvents.length,
        queryStatus: "done",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    mapPositionDateEventsQuery.status,
    mapPositionDateEventsQuery.data?.length,
    upcomingEventsQuery.status,
    upcomingEventsQuery.data?.length,
    setMapDisplayEventsInfo,
    setMapPositionDateEvents,
    setUpcomingEvents,
  ]);

  return mapDisplayEvents;
};
