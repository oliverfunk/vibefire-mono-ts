import { type TModelVibefireUser } from "!models/data/vibefire-user";

export type AppUserLoading = {
  state: "loading";
};
export type AppUserError = {
  state: "error";
  error: string;
};
export type AppUserUnauthenticated = {
  state: "unauthenticated";
  anonId: string;
};
export type AppUserAuthenticated = {
  state: "authenticated";
  userId: string;
  userInfo: TModelVibefireUser;
};
export type AppUserState =
  | AppUserLoading
  | AppUserError
  | AppUserUnauthenticated
  | AppUserAuthenticated;
