import { useEffect, type ReactNode } from "react";
import { StatusBar, Text, View } from "react-native";
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

import { NewBottomPanelModal } from "!/components/bottom-panel/BottomPanelModal";
import { VfActionButton } from "!/components/VfActionButton";
import { EventMap } from "!/c/event/EventMap";
import { NoTopContainer } from "!/c/misc/NoTopContainer";

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
          {/* Cannot dyn. set the bottom's, 2*handle height + 10 for ios, +15 for and */}
          <View className="android:bottom-[55] ios:bottom-[90] absolute w-full px-3">
            <VfActionButton />
          </View>
          <NewBottomPanelModal>
            <Stack
              screenOptions={{
                headerShown: false,
                contentStyle: { backgroundColor: "#171717", paddingTop: 5 },
              }}
            />
          </NewBottomPanelModal>
        </NoTopContainer>
      </PostProviders>
    </AppProviders>
  );
};

export default RootLayout;
