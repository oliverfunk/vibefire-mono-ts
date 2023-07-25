import { useEffect } from "react";
import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

import AppProviders from "~/providers";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  useEffect(() => {
    const load = async () => {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    };
    load();
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AppProviders>
      <SafeAreaProvider>
        <Stack>
          <Stack.Screen
            name="index"
            options={{
              // Hide the header for all other routes.
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modal"
            options={{
              // Set the presentation mode to modal for our modal route.
              presentation: "modal",
            }}
          />
        </Stack>
        <StatusBar />
      </SafeAreaProvider>
    </AppProviders>
  );
};

export default RootLayout;
