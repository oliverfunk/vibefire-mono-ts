import { useCallback, useMemo, type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useAuth, useOAuth, type UseOAuthFlowParams } from "@clerk/clerk-expo";
import { useSetAtom } from "jotai";

import { useWarmUpBrowser } from "!/hooks/useWarmUpBrowser";

import { userAtom } from "!/atoms";

WebBrowser.maybeCompleteAuthSession();

export const AuthButton = (props: {
  oauth: UseOAuthFlowParams;
  text: string;
  icon: ReactNode;
  classNameBtn?: string;
  classNameText?: string;
}) => {
  useWarmUpBrowser();

  const setUser = useSetAtom(userAtom);

  const { signOut } = useAuth();

  const { startOAuthFlow } = useOAuth(props.oauth);
  const oauthRedirectUrl = useMemo(
    () =>
      AuthSession.makeRedirectUri({
        path: "/profile",
      }),
    [],
  );

  const onPress = useCallback(async () => {
    try {
      setUser({ state: "loading" });

      await signOut();

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: oauthRedirectUrl,
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        return;
      }
    } catch (err) {
      console.error("OAuth error", err);
    }
    setUser({ state: "unauthenticated", anonId: "anon" });
  }, [oauthRedirectUrl, setUser, signOut, startOAuthFlow]);

  return (
    <TouchableOpacity
      className={`flex-row items-center justify-start rounded-lg p-3 ${
        props.classNameBtn ?? "border"
      }`}
      onPress={onPress}
    >
      <View className="w-10 items-center">{props.icon}</View>
      <Text className={`text-center ${props.classNameText}`}>{props.text}</Text>
    </TouchableOpacity>
  );
};
