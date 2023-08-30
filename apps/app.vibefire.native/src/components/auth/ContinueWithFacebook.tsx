import { useCallback } from "react";
import { Button, Text, TouchableOpacity } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { FontAwesome5 } from "@expo/vector-icons";

import { useWarmUpBrowser } from "~/hooks/useWarmUpBrowser";
import { AuthButton } from "./_shared";

WebBrowser.maybeCompleteAuthSession();

export const ContinueWithFacebook = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_facebook" });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow({});

      if (createdSessionId) {
        if (!setActive) {
          return;
        }

        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  return (
    <AuthButton
      icon={<FontAwesome5 name="facebook" size={24} color="black" />}
      text="Continue with Facebook"
      onPress={onPress}
    />
  );
};
