import { TouchableOpacity } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { useSetAtom } from "jotai";

import { TextB } from "!/components/atomic/text";
import { BContC } from "!/components/atomic/view";
import { SheetScrollViewGradientVF } from "!/components/layouts/SheetScrollViewGradientVF";
import { userSessionRetryAtom } from "!/atoms";

export const UserProfileErrorSheet = () => {
  const setUserSessionRetry = useSetAtom(userSessionRetryAtom);

  return (
    <SheetScrollViewGradientVF>
      <BContC>
        <FontAwesome5 name="user-alt" size={50} color="red" />
        <TextB>There was an issue loading your profile</TextB>
        <TouchableOpacity
          className="rounded-lg border bg-green-500 px-4 py-2"
          onPress={() => {
            setUserSessionRetry((prev) => !prev);
          }}
        >
          <TextB>Try again</TextB>
        </TouchableOpacity>
      </BContC>
    </SheetScrollViewGradientVF>
  );
};
