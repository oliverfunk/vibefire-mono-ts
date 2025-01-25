import { useFocusEffect } from "expo-router";

import { trpc } from "!/api/trpc-client";
import { useAppUser } from "!/hooks/useAppUser";
import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";

import {
  UserProfileAuthenticatedSheet,
  UserProfileErrorSheet,
  UserProfileUnauthenticatedSheet,
} from "!/features/user-profile";
import { LoadingSheet } from "!/components/misc/sheet-utils";

const Screen = () => {
  const utils = trpc.useUtils();

  useExpandBottomSheet();
  useFocusEffect(() => {
    void utils.invalidate();
  });

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
