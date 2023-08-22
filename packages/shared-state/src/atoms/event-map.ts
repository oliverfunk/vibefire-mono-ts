import { atom } from "jotai";

import { type MapPositionInfoT, type MapQueryInfoT } from "@vibefire/models";

export const mapQueryPositionAtom = atom<MapPositionInfoT | null>(null);
export const mapQueryTimePeriodAtom = atom<string>("20230720/A");
export const mapQueryInfo = atom<MapQueryInfoT>({
  numberOfEvents: 0,
  queryStatus: "done",
});
