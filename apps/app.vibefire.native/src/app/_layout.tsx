import { useEffect } from "react";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import * as Linking from "expo-linking";
import { Stack, useGlobalSearchParams, usePathname } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ClerkLoaded } from "@clerk/clerk-expo";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import * as Sentry from "sentry-expo";

import AppProviders from "~/providers";

import "~/global.css";

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";

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
      // Pass instrumentation to be used as `routingInstrumentation`
      routingInstrumentation,
      // ...
    }),
  ],
});

void SplashScreen.preventAutoHideAsync();

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

  const pathname = usePathname();
  const params = useGlobalSearchParams();

  useEffect(() => {
    console.log("pathname", pathname);
    console.log("path params", JSON.stringify(params, null, 2));
  }, [pathname, params]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <ClerkLoaded>
        <BottomSheetModalProvider>
          <NoTopContainer>
            <StatusBar />
            <EventMap />
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
            <Toast />
          </NoTopContainer>
        </BottomSheetModalProvider>
      </ClerkLoaded>
    </AppProviders>
  );
};

export default RootLayout;
