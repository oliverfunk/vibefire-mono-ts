import { FontAwesome5 } from "@expo/vector-icons";
import { useAtom, useSetAtom } from "jotai";

import { TextB } from "!/components/atomic/text";
import { BContC, DivLineH } from "!/components/atomic/view";
import { SignOut } from "!/components/auth/SignOut";
import { PillTouchableOpacity } from "!/components/button/PillTouchableOpacity";
import { SheetScrollViewGradientVF } from "!/components/layouts/SheetScrollViewGradientVF";
import { userAtom, userSessionRetryAtom } from "!/atoms";

export const UserProfileErrorSheet = () => {
  const [user] = useAtom(userAtom);
  const setUserSessionRetry = useSetAtom(userSessionRetryAtom);

  return (
    <SheetScrollViewGradientVF>
      <BContC>
        <FontAwesome5 name="user-alt" size={50} color="red" />
        <TextB>There was an issue loading your profile</TextB>
        <PillTouchableOpacity
          className="bg-green-500"
          onPress={() => {
            setUserSessionRetry((prev) => !prev);
          }}
        >
          <TextB>Try again</TextB>
        </PillTouchableOpacity>

        {user.state === "authenticated" && (
          <>
            <DivLineH />

            <TextB>Or try singing out and back in again.</TextB>
            <SignOut />
          </>
        )}
      </BContC>
    </SheetScrollViewGradientVF>
  );
};
