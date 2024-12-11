import { useFocusEffect, useRouter } from "expo-router";
import { useAtom } from "jotai";

import { userAtom } from "!/atoms";

export const useOnFocusUserNotAuthedRedirect = () => {
  const [user] = useAtom(userAtom);
  const router = useRouter();

  useFocusEffect(() => {
    if (user.state !== "authenticated") {
      router.replace("/profile");
    }
  });
};
