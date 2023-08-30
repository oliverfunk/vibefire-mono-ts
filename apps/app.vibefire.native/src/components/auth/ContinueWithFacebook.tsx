import { FontAwesome5 } from "@expo/vector-icons";

import { AuthButton } from "./_shared";

export const ContinueWithFacebook = () => {
  return (
    <AuthButton
      oauth={{ strategy: "oauth_facebook" }}
      icon={<FontAwesome5 name="facebook" size={24} color="white" />}
      text="Continue with Facebook"
      classNameBtn="bg-[#1877F2]"
      classNameText="text-white font-bold"
    />
  );
};
