import { atom } from "jotai";

import { type AppUserState, type TimeOfDayT } from "@vibefire/models";

export const profileSelectedAtom = atom(false);
export const userSessionRetryAtom = atom(false);
export const userAtom = atom<AppUserState>({
  state: "loading",
});
