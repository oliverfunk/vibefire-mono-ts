import { useEffect } from "react";
import { useSetAtom } from "jotai";

import { UserProfileSheet } from "!/features/user-profile";
import { showHandleAtom } from "!/atoms";

const Screen = () => {
  const showHandle = useSetAtom(showHandleAtom);
  useEffect(() => {
    showHandle(false);
  }, [showHandle]);

  return <UserProfileSheet />;
};
export default Screen;
