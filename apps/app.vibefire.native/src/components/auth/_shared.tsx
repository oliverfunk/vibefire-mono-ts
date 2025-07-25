import { useCallback, useMemo, type ReactNode } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useAuth, useOAuth, type UseOAuthFlowParams } from "@clerk/clerk-expo";
import { useAtom } from "jotai";

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

  const [user, setUser] = useAtom(userAtom);

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
    const anonId =
      user.state === "unauthenticated" ? user.anonId : "oauth-error-none";
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
    setUser({ state: "unauthenticated", anonId });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [oauthRedirectUrl, setUser, signOut, startOAuthFlow, user.state]);

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
