import { useAppUser } from "!/hooks/useAppUser";
import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";

import {
  UserProfileAuthenticatedSheet,
  UserProfileErrorSheet,
  UserProfileUnauthenticatedSheet,
} from "!/features/user-profile";
import { LoadingSheet } from "!/components/misc/sheet-utils";

const Screen = () => {
  useExpandBottomSheet();

  const user = useAppUser();

  switch (user.state) {
    case "loading":
      return <LoadingSheet />;
    case "error":
      return <UserProfileErrorSheet />;
    case "unauthenticated":
      return <UserProfileUnauthenticatedSheet />;
    case "authenticated":
      return <UserProfileAuthenticatedSheet appUser={user} />;
  }
};
export default Screen;
