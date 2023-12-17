import { useEffect } from "react";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ClerkLoaded } from "@clerk/clerk-expo";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";
import * as Sentry from "sentry-expo";

import AppProviders from "~/providers";

import "~/global.css";

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

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <ClerkLoaded>
        {/* Idk what this is */}
        <StatusBar />
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              // Hide the header for all other routes.
              headerShown: false,
            }}
          />
        </Stack>
        <Toast />
      </ClerkLoaded>
    </AppProviders>
  );
};

export default RootLayout;
