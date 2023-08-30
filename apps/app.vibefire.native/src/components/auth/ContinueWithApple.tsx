import { useCallback } from "react";
import { Button, Text, TouchableOpacity, View } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";
import { FontAwesome } from "@expo/vector-icons";

import { useWarmUpBrowser } from "~/hooks/useWarmUpBrowser";
import { AuthButton } from "./_shared";

WebBrowser.maybeCompleteAuthSession();

export const ContinueWithApple = () => {
  useWarmUpBrowser();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_apple" });

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
      icon={<FontAwesome name="apple" size={24} color="black" />}
      text="Continue with Apple"
      onPress={onPress}
    />
  );
};
