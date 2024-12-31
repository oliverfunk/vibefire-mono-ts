import { useExpandBottomSheet } from "!/hooks/useExpandBottomSheet";
import { useOnFocusUserNotAuthedRedirect } from "!/hooks/useUserAuthedRedirect";

import { ManagedByUserSheet } from "!/features/event/managed-by-user";

const Screen = () => {
  useOnFocusUserNotAuthedRedirect();
  useExpandBottomSheet();

  return <ManagedByUserSheet />;
};
export default Screen;
