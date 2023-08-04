import { atom } from "jotai";

import { MapPositionInfo, MapQueryInfo } from "@vibefire/models";

export const mapQueryPositionAtom = atom<MapPositionInfo | null>(null);
export const mapQueryTimePeriodAtom = atom<string>("20230720/A");
export const mapQueryInfo = atom<MapQueryInfo>({
  numberOfEvents: 0,
  queryStatus: "done",
});
