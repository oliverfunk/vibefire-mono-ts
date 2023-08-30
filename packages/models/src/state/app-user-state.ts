import { type VibefireUserT } from "~/vibefire-user";

type AppUserLoading = {
  state: "loading";
};
type AppUserError = {
  state: "error";
  error: string;
};
type AppUserUnauthenticated = {
  state: "unauthenticated";
  anonId: string;
};
type AppUserAuthenticated = {
  state: "authenticated";
  userId: string;
  userInfo: VibefireUserT;
};
export type AppUserState =
  | AppUserLoading
  | AppUserError
  | AppUserUnauthenticated
  | AppUserAuthenticated;
