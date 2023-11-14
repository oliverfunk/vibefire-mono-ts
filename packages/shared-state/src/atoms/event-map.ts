import { atom } from "jotai";
import { type DateTime } from "luxon";

import {
  type MapPositionInfoT,
  type MapQueryInfoT,
  type TimeOfDayT,
  type VibefireEventT,
} from "@vibefire/models";
import { nowAsUTC, toQueryStr } from "@vibefire/utils";

export const selectedTimeOfDayAtom = atom<TimeOfDayT>("D");
export const selectedDateStrAtom = atom<DateTime>(nowAsUTC());

export const mapQueryPositionAtom = atom<MapPositionInfoT | null>(null);
export const mapQueryTimePeriodAtom = atom<string>((get) => {
  const tod = get(selectedTimeOfDayAtom);
  const ds = get(selectedDateStrAtom);
  return toQueryStr(ds, tod);
});
export const mapQueryInfo = atom<MapQueryInfoT>({
  numberOfEvents: 0,
  queryStatus: "done",
});
export const mapQueryResult = atom<VibefireEventT[]>([]);
