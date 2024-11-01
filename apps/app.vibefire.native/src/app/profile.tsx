import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";

import { UserProfileSheet } from "!/features/user-profile";

const Screen = () => {
  useExpandBottomSheet();

  return <UserProfileSheet />;
};
export default Screen;
