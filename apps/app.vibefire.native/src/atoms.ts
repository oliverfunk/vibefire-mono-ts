import { atom } from "jotai";

import { type AppUserState, type TimeOfDayT } from "@vibefire/models";

export const selectedTimeOfDayAtom = atom<TimeOfDayT>("D");
export const selectedDateStrAtom = atom<Date>(new Date());
export const profileSelectedAtom = atom(false);
export const userSessionRetryAtom = atom(false);
export const userAtom = atom<AppUserState>({
  state: "loading",
});
