import { useEffect } from "react";
import { StatusBar } from "react-native";
import Toast from "react-native-toast-message";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

import AppProviders from "~/providers";

import "~/global.css";

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
    </AppProviders>
  );
};

export default RootLayout;
