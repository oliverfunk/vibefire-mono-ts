import type { ExpoConfig } from "@expo/config";

const CLERK_PUBLISHABLE_KEY =
  "pk_test_c2V0dGxlZC1tb3JheS0zMi5jbGVyay5hY2NvdW50cy5kZXYk";

const defineConfig = (): ExpoConfig => ({
  name: "Vibefire",
  slug: "vibefire-app",
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
      googleMapsApiKey: "AIzaSyCeqR2spuZJN30WEIdjvx4YFHOpbFGFIs4",
    },
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/icon.png",
      backgroundColor: "#010101",
    },
    config: {
      googleMaps: {
        apiKey: "AIzaSyCeqR2spuZJN30WEIdjvx4YFHOpbFGFIs4",
      },
    },
  },
  extra: {
    eas: {
      // projectId: "your-project-id",
    },
    CLERK_PUBLISHABLE_KEY,
  },
  plugins: [
    "./expo-plugins/with-modify-gradle.js",
    [
      "expo-location",
      {
        locationAlwaysAndWhenInUsePermission:
          "Allow $(PRODUCT_NAME) to use your location.",
      },
    ],
  ],
});

export default defineConfig;
