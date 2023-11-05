import { useCallback, useMemo, type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useAuth, useOAuth, type UseOAuthFlowParams } from "@clerk/clerk-expo";

import { useWarmUpBrowser } from "~/hooks/useWarmUpBrowser";

WebBrowser.maybeCompleteAuthSession();

export const AuthButton = (props: {
  oauth: UseOAuthFlowParams;
  text: string;
  icon: ReactNode;
  classNameBtn?: string;
  classNameText?: string;
}) => {
  useWarmUpBrowser();

  const { signOut } = useAuth();

  const { startOAuthFlow } = useOAuth(props.oauth);
  const oauthRedirectUrl = useMemo(
    () =>
      AuthSession.makeRedirectUri({
        path: "/",
      }),
    [],
  );

  const onPress = useCallback(async () => {
    try {
      await signOut();

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: oauthRedirectUrl,
      });

      if (createdSessionId) {
        if (!setActive) {
          return;
        }

        await setActive({ session: createdSessionId });
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
  }, [oauthRedirectUrl, signOut, startOAuthFlow]);

  return (
    <TouchableOpacity
      className={`flex-row items-center rounded-lg p-3 ${
        props.classNameBtn ?? "border"
      }`}
      onPress={onPress}
    >
      <View className="w-10 items-center">{props.icon}</View>
      <Text className={props.classNameText}>{props.text}</Text>
    </TouchableOpacity>
  );
};
