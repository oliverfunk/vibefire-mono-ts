import { useCallback } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";

import { useWarmUpBrowser } from "~/hooks/useWarmUpBrowser";
import { AuthButton } from "./_shared";

WebBrowser.maybeCompleteAuthSession();

export const ContinueWithGoogle = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    console.log("onPress");

    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({});

      if (createdSessionId) {
        if (!setActive) {
          return;
        }

        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    }
  }, [startOAuthFlow]);

  return (
    <AuthButton
      icon={<FontAwesome name="google" size={24} color="black" />}
      text="Continue with Google"
      onPress={onPress}
    />
  );
};
