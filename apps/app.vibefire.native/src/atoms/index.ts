import { atom } from "jotai";

import { type AppUserState } from "@vibefire/models";

export const profileSelectedAtom = atom<boolean>(false);
export const userSessionRetryAtom = atom<boolean>(false);
export const userAtom = atom<AppUserState>({
  state: "loading",
});
