import { useEffect } from "react";
import { StatusBar } from "react-native";
import * as Linking from "expo-linking";
import {
  Stack,
  useGlobalSearchParams,
  useNavigationContainerRef,
  usePathname,
} from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import {
  Inter_500Medium,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import * as Sentry from "@sentry/react-native";

import { useRegisterPushToken } from "!/hooks/useRegisterPushToken";
import AppProviders from "!/providers";

import "!/global.css";

import * as Notifications from "expo-notifications";

import { EventMap } from "!/components/event/EventMap";
import { NoTopContainer } from "!/components/utils/NoTopContainer";

const routingInstrumentation = new Sentry.ReactNavigationInstrumentation();

Sentry.init({
  enabled: !__DEV__,
  dsn: "https://959cd563f46e2574f10469f5b03e8d6e@o4506169650315264.ingest.sentry.io/4506169652412416",
  integrations: [
    new Sentry.ReactNativeTracing({
      // routingInstrumentation,
      // enableUserInteractionTracing: true,
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
  const [fontsLoaded, fontsError] = useFonts({
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    void (async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    })();
  }, [fontsLoaded]);

  const ref = useNavigationContainerRef();

  useEffect(() => {
    if (ref) {
      routingInstrumentation.registerNavigationContainer(ref);
    }
  }, [ref]);

  if (fontsError) console.warn(fontsError);

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

export default Sentry.wrap(RootLayout);
