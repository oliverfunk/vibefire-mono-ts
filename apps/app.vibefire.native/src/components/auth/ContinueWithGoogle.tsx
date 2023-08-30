import { FontAwesome } from "@expo/vector-icons";

import { AuthButton } from "./_shared";

export const ContinueWithGoogle = () => {
  return (
    <AuthButton
      oauth={{ strategy: "oauth_google" }}
      icon={<FontAwesome name="google" size={24} color="black" />}
      text="Continue with Google"
      classNameBtn="bg-white shadow-sm shadow-gray-400"
      classNameText="font-bold text-black/60"
    />
  );
};
