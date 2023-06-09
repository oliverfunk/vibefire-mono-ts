// This is the main layout of the app

import { StatusBar } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Constants from "expo-constants";
import { SplashScreen, Stack } from "expo-router";
import { ClerkProvider } from "@clerk/clerk-expo";
import { Inter_500Medium, useFonts } from "@expo-google-fonts/inter";

import { tokenCache } from "~/utils/cache";
import { TRPCProvider } from "~/utils/trpc";

// It wraps your pages with the providers they need
const RootLayout = () => {
  // Load the font `Inter_500Medium`
  const [fontsLoaded] = useFonts({
    Inter_500Medium,
  });

  if (!fontsLoaded) {
    // The native splash screen will stay visible for as long as there
    // are `<SplashScreen />` components mounted. This component can be nested.

    return <SplashScreen />;
  }

  return (
    <ClerkProvider
      publishableKey={
        Constants.expoConfig?.extra?.CLERK_PUBLISHABLE_KEY as string
      }
      tokenCache={tokenCache}
    >
      <TRPCProvider>
        <SafeAreaProvider>
          {/*
                  The Stack component displays the current page.
                  It also allows you to configure your screens
                */}
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
      </TRPCProvider>
    </ClerkProvider>
  );
};

export default RootLayout;
