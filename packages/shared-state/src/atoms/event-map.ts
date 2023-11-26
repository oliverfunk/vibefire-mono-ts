import { atom } from "jotai";
import { type DateTime } from "luxon";

import {
  type MapDisplayEventsInfoT,
  type MapPositionInfoT,
  type TimeOfDayT,
  type VibefireEventT,
} from "@vibefire/models";
import { nowAsNTZ } from "@vibefire/utils";

export const todayDTAtom = atom<DateTime>(nowAsNTZ());

export const selectedTimeOfDayAtom = atom<TimeOfDayT>("D");
export const selectedDateDTAtom = atom<DateTime>(nowAsNTZ());

export const mapPositionInfoAtom = atom<MapPositionInfoT | null>(null);

export const displayEventsInfoAtom = atom<MapDisplayEventsInfoT>({
  numberOfEvents: 0,
  queryStatus: "done",
});

export const mapPositionDateEventsQueryResultAtom = atom<VibefireEventT[]>([]);
export const upcomingEventsQueryResultAtom = atom<VibefireEventT[]>([]);
