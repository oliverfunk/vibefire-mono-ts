import { useLayoutEffect } from "react";
import { useBottomSheet } from "@gorhom/bottom-sheet";

import { UserProfileSheet } from "!/features/user-profile";

const Screen = () => {
  const { expand } = useBottomSheet();

  useLayoutEffect(() => {
    expand();
  }, [expand]);

  return <UserProfileSheet />;
};
export default Screen;
