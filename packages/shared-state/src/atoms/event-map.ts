import { atom } from "jotai";

import {
  type MapPositionInfoT,
  type MapQueryInfoT,
  type VibefireEventT,
} from "@vibefire/models";

export const mapQueryPositionAtom = atom<MapPositionInfoT | null>(null);
export const mapQueryTimePeriodAtom = atom<string>("20230720/A");
export const mapQueryInfo = atom<MapQueryInfoT>({
  numberOfEvents: 0,
  queryStatus: "done",
});
export const mapQueryResult = atom<VibefireEventT[]>([]);
