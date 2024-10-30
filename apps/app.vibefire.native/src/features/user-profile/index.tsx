import { useAtom } from "jotai";

import { userAtom } from "!/atoms";
import { LoadingSheet } from "!/c/misc/sheet-utils";

import { UserProfileAuthenticatedView } from "./_authenticated";
import { UserProfileErrorView } from "./_error";
import { UserProfileUnauthenticatedView } from "./_unauthenticated";

export const UserProfileSheet = () => {
  const [user] = useAtom(userAtom);

  switch (user.state) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <UserProfileErrorView />;
    case "unauthenticated":
      return <UserProfileUnauthenticatedView />;
    case "authenticated":
      return <UserProfileAuthenticatedView appUser={user} />;
  }
};
