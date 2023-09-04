import { atom } from "jotai";

import { type AppUserState } from "@vibefire/models";

export const profileSelectedAtom = atom(false);
export const userSessionRetryAtom = atom(false);
export const userAtom = atom<AppUserState>({
  state: "loading",
});

export const manageEventSheetSnapPointsAtom = atom(["80%"]);
export const manageEventSheetSnapIdxAtom = atom(0);
