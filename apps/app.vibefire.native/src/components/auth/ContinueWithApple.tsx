import { FontAwesome } from "@expo/vector-icons";

import { AuthButton } from "./_shared";

export const ContinueWithApple = () => {
  return (
    <AuthButton
      oauth={{ strategy: "oauth_apple" }}
      icon={<FontAwesome name="apple" size={24} color="white" />}
      text="Continue with Apple"
      classNameBtn="bg-black"
      classNameText="text-white font-bold"
    />
  );
};
