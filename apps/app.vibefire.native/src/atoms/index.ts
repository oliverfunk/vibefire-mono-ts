import { atom } from "jotai";

import { type VibefireUserInfoT } from "@vibefire/models";

export const profileSelectedAtom = atom<boolean>(false);
export const userAtom = atom<VibefireUserInfoT | undefined>(undefined);
