import { useEffect } from "react";
import { useSetAtom } from "jotai";

import { UserProfileSheet } from "!/features/user-profile";
import { bottomSheetIndex } from "!/atoms";

const Screen = () => {
  const showHandle = useSetAtom(bottomSheetIndex);
  useEffect(() => {
    showHandle(false);
  }, [showHandle]);

  return <UserProfileSheet />;
};
export default Screen;
