import type MapView from "react-native-maps";
import { atom } from "jotai";

import { type AppUserState } from "@vibefire/models";

export const editEventButtonStateAtom = atom("inital");
export const profileSelectedAtom = atom(false);
export const userSessionRetryAtom = atom(false);
export const userAtom = atom<AppUserState>({
  state: "loading",
});
export const eventMapMapRefAtom = atom<MapView | null>(null);
export const mainBottomSheetPresentToggleAtom = atom({
  initial: true,
  present: false,
  toggle: false,
});
