import { useCallback } from "react";
import { Button } from "react-native";
import * as WebBrowser from "expo-web-browser";
import { useOAuth } from "@clerk/clerk-expo";

import { useWarmUpBrowser } from "~/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

const SignInWithOAuth = () => {
  useWarmUpBrowser();

  // const { signIn } = useSignIn();

  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });

  const onPress = useCallback(async () => {
    try {
      const { createdSessionId, signIn, signUp, setActive } =
        await startOAuthFlow({});

      if (createdSessionId) {
        if (!setActive) {
          return;
        }

        await setActive({ session: createdSessionId });
      } else {
        // Use signIn or signUp for next steps such as MFA
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [startOAuthFlow]);

  return <Button title="Sign in with Google" onPress={onPress} />;
};
export default SignInWithOAuth;
