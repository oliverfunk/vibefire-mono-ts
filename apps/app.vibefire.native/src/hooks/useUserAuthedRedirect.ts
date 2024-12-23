import { useFocusEffect, useRouter } from "expo-router";
import { useAtom } from "jotai";

import { userAtom } from "!/atoms";
import { navProfile } from "!/nav";

export const useOnFocusUserNotAuthedRedirect = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  useFocusEffect(() => {
    if (user.state !== "authenticated") {
      navProfile(router);
    }
  });
};
