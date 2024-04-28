import { useEffect, type ReactNode } from "react";
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

import { useRegisterPushToken } from "!/hooks/useRegisterPushToken";

import AppProviders, { routingInstrumentation } from "!/providers";

import "!/global.css";

import * as Notifications from "expo-notifications";

import { EventMap } from "!/components/event/EventMap";
import { NoTopContainer } from "!/components/utils/NoTopContainer";

Notifications.setNotificationHandler({
  // eslint-disable-next-line @typescript-eslint/require-await
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

SplashScreen.preventAutoHideAsync().catch(console.warn);

const PostProviders = (props: { children: ReactNode }) => {
  const { children } = props;

  useRegisterPushToken();

  const deeplinkURL = Linking.useURL();
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  const navContRef = useNavigationContainerRef();

  useEffect(() => {
    if (navContRef) {
      routingInstrumentation.registerNavigationContainer(navContRef);
    }
  }, [navContRef]);

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

  return children;
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

  if (fontsError) console.warn(fontsError);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <PostProviders>
        <StatusBar barStyle={"dark-content"} />
        <NoTopContainer>
          <EventMap />
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </NoTopContainer>
      </PostProviders>
    </AppProviders>
  );
};

export default RootLayout;
