import { Text, TouchableOpacity } from "react-native";
import { useAuth } from "@clerk/clerk-expo";

export const SignOut = () => {
  const { signOut } = useAuth();

  return (
    <TouchableOpacity
      className="rounded-lg border px-4 py-2"
      onPress={async () => {
        await signOut();
      }}
    >
      <Text className="text-blue-500">Sign out</Text>
    </TouchableOpacity>
  );
};
