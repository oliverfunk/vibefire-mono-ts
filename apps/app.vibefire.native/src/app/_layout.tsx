import { useEffect } from "react";
import { StatusBar } from "react-native";
import * as Linking from "expo-linking";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import * as Sentry from "sentry-expo";

import { useRegisterPushToken } from "~/hooks/useRegisterPushToken";
import AppProviders from "~/providers";

import "~/global.css";

import * as Notifications from "expo-notifications";

import { EventMap } from "~/components/event/EventMap";
import { NoTopContainer } from "~/components/NoTopContainer";

const routingInstrumentation =
  new Sentry.Native.ReactNavigationInstrumentation();

Sentry.init({
  dsn: "https://959cd563f46e2574f10469f5b03e8d6e@o4506169650315264.ingest.sentry.io/4506169652412416",
  enableInExpoDevelopment: false,
  debug: process.env.EXPO_PUBLIC_ENVIRONMENT === "local", // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  integrations: [
    new Sentry.Native.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
});

Notifications.setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync().catch(console.warn);

const PostProvidersInject = () => {
  useRegisterPushToken();

  const deeplinkURL = Linking.useURL();
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    if (deeplinkURL) {
      const { hostname, path, queryParams } = Linking.parse(deeplinkURL);

      console.log(
        `Linked to app with hostname: ${hostname}, path: ${path} and data: ${JSON.stringify(
          queryParams,
        )}`,
      );
    }
  }, [deeplinkURL]);

  useEffect(() => {
    console.log("routing pathname", pathname);
    console.log("routing params", JSON.stringify(params, null, 2));
  }, [pathname, params]);

  return null;
};

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    void (async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    })();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <PostProvidersInject />
      <StatusBar barStyle={"dark-content"} />
      <NoTopContainer>
        <EventMap />
        <Stack
          screenOptions={{
            headerShown: false,
          }}
        />
      </NoTopContainer>
    </AppProviders>
  );
};

export default RootLayout;
