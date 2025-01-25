import type MapView from "react-native-maps";
import { atom } from "jotai";

import { type AppUserState } from "@vibefire/models";

export const bottomSheetIndex = atom(0);
export const bottomSheetCollapsedAtom = atom(
  (get) => get(bottomSheetIndex) === 0,
);

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
export const userInfoAtom = atom((get) => {
  const user = get(userAtom);
  if (user.state !== "authenticated") {
    return undefined;
  }
  return user.userInfo;
});
export const userAuthStateAtom = atom((get) => get(userAtom).state);
