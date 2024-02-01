import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export const SignOut = () => {
  const { signOut } = useAuth();

  return (
    <TouchableOpacity
      className="rounded-lg bg-black px-4 py-2"
      onPress={async () => {
        await signOut();
      }}
    >
      <Text className="text-white">Sign out</Text>
    </TouchableOpacity>
  );
};
