import { atom } from "jotai";
import { type DateTime } from "luxon";

import {
  type MapDisplayEventsInfoT,
  type MapPositionInfoT,
  type TimeOfDayT,
  type TModelVibefireEvent,
} from "@vibefire/models";
import { nowAsUTCNoTime } from "@vibefire/utils";

export const todayDTAtom = atom<DateTime>(nowAsUTCNoTime());

export const selectedTimeOfDayAtom = atom<TimeOfDayT>("D");
export const selectedDateDTAtom = atom<DateTime>(nowAsUTCNoTime());

export const mapPositionInfoAtom = atom<MapPositionInfoT | null>(null);

export const mapDisplayableEventsAtom = atom<TModelVibefireEvent[]>([]);

export const mapDisplayableEventsInfoAtom = atom<MapDisplayEventsInfoT>({
  numberOfEvents: 0,
  queryStatus: "done",
});
