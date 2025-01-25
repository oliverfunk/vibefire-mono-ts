import "!/global.css";

import { useEffect, type ReactNode } from "react";
import { StatusBar, View } from "react-native";
import {
  configureReanimatedLogger,
  ReanimatedLogLevel,
} from "react-native-reanimated";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
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

import { GeoQueryMap } from "!/features/geo-query/GeoQueryMap";
import { VfActionButton } from "!/features/vf-action-button";
import { BottomPanel } from "!/components/bottom-panel/BottomPanel";
import { NoTopContainer } from "!/c/misc/NoTopContainer";
import AppProviders, { navigationIntegration } from "!/providers";

// strict warning messages coming from tod picker/carousel
configureReanimatedLogger({
  level: ReanimatedLogLevel.warn,
  strict: false,
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

// Set the animation options. This is optional.
SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});

const PostProviders = (props: { children: ReactNode }) => {
  const { children } = props;

  useRegisterPushToken();

  const deeplinkURL = Linking.useURL();
  const pathname = usePathname();
  const params = useGlobalSearchParams();

  const navContRef = useNavigationContainerRef();

  useEffect(() => {
    if (navContRef?.current) {
      navigationIntegration.registerNavigationContainer(navContRef);
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

  // useEffect(() => {
  //   console.log("routing pathname", pathname);
  //   console.log("routing params", JSON.stringify(params, null, 2));
  // }, [pathname, params]);

  return children;
};

export default function HomeLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    Inter_500Medium,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      SplashScreen.hide();
    }
  }, [fontsLoaded, fontsError]);

  if (fontsError) console.warn(fontsError);

  if (!fontsLoaded && !fontsError) {
    return null;
  }

  return (
    <AppProviders>
      <PostProviders>
        <StatusBar barStyle={"light-content"} />
        <NoTopContainer>
          <GeoQueryMap />
          {/* Cannot dyn. set the bottom's, 2*handle height + 10 for ios, +15 for and */}

          <VfActionButton />

          <BottomPanel>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "black" },
              }}
            />
          </BottomPanel>
        </NoTopContainer>
      </PostProviders>
    </AppProviders>
  );
}
