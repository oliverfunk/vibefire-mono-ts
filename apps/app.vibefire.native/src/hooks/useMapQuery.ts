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

import { trpc } from "~/apis/trpc-client";

const useUpcomingEventsQuery = () => {
  const [todayIsoNTZ] = useAtom(todayDTAtom);
  const upcomingEvents = trpc.events.upcomingEvents.useQuery({
    currentIsoNTZ: todayIsoNTZ.toISO()!,
  });
  return upcomingEvents;
};

const useMapPositionDateEventsQuery = () => {
  const [mapPos] = useAtom(mapPositionInfoAtom);
  const [selectedDT] = useAtom(selectedDateDTAtom);
  const mapQuery = trpc.events.maPositionDatePublicEvents.useQuery(
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
          timePeriod: toDateStr(selectedDT),
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

  const [todayDT] = useAtom(todayDTAtom);
  const [selectedDateDT] = useAtom(selectedDateDTAtom);

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
      let upcomingEvents = upcomingEventsQuery.data;
      if (!selectedDateDT.hasSame(todayDT, "day")) {
        upcomingEvents = upcomingEvents.filter((v) =>
          v.displayTimePeriods.includes(toDateStr(selectedDateDT)),
        );
      }
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
    upcomingEventsQuery.status,
    setMapDisplayEventsInfo,
    setMapPositionDateEvents,
    setUpcomingEvents,
    selectedDateDT,
    todayDT,
  ]);

  return mapDisplayEvents;
};
