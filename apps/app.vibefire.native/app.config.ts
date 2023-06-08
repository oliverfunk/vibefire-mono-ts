import type { ExpoConfig } from "@expo/config";

const CLERK_PUBLISHABLE_KEY =
  "***REMOVED***";

const defineConfig = (): ExpoConfig => ({
  name: "Vibefire",
  slug: "vibefire-native",
  scheme: "vfire",
  version: "0.1.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  userInterfaceStyle: "light",
  splash: {
    image: "./assets/icon.png",
    resizeMode: "contain",
    backgroundColor: "#010101",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
    bundleIdentifier: "app.vibefire.native",
    config: {
      googleMapsApiKey: "***REMOVED***",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#010101",
    },
    config: {
      googleMaps: {
        apiKey: "***REMOVED***",
      },
    },
  },
  extra: {
    eas: {
      // projectId: "your-project-id",
    },
    CLERK_PUBLISHABLE_KEY,
  },
  plugins: ["./expo-plugins/with-modify-gradle.js"],
});

export default defineConfig;
