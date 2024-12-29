import { Text, TouchableOpacity, TouchableOpacityProps } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { FontAwesome5, FontAwesome6 } from "@expo/vector-icons";

import { PillTouchableOpacity } from "../button/PillTouchableOpacity";

export const SignOut = () => {
  const { signOut } = useAuth();

  return (
    <PillTouchableOpacity
      onPress={async () => {
        await signOut();
      }}
    >
      <Text className="text-center text-white">
        <FontAwesome5 name="sign-out-alt" size={15} /> Sign out
      </Text>
    </PillTouchableOpacity>
  );
};
